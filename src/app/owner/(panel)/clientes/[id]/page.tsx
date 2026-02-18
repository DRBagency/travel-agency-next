import { supabaseAdmin } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getTranslations } from 'next-intl/server';
import ConnectStripeButton from "./ConnectStripeButton";
import AIRecommendations from "@/components/ai/AIRecommendations";

async function updateCliente(formData: FormData) {
  "use server";

  const id = formData.get("id") as string;

  const payload: Record<string, any> = {
    nombre: (formData.get("nombre") as string) || null,
    domain: (formData.get("domain") as string) || null,
    primary_color: (formData.get("primary_color") as string) || null,
    hero_title: (formData.get("hero_title") as string) || null,
    hero_subtitle: (formData.get("hero_subtitle") as string) || null,
    hero_cta_text: (formData.get("hero_cta_text") as string) || null,
    plan: (formData.get("plan") as string) || null,
    activo: formData.get("activo") === "on",
  };

  const plan = (formData.get("plan") as string) || "";
  const commissionByPlan: Record<string, number> = {
    start: 0.05,
    grow: 0.03,
    pro: 0.01,
  };
  if (plan && plan in commissionByPlan) {
    payload.commission_rate = commissionByPlan[plan];
  }

  await supabaseAdmin.from("clientes").update(payload).eq("id", id);

  redirect("/owner/clientes");
}

async function connectStripe(formData: FormData) {
  "use server";

  const t = await getTranslations('owner.clientes');
  const id = formData.get("id") as string;

  const host = (await headers()).get("host");
  const rawBase =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.VERCEL_URL ||
    (host ? `http://${host}` : "");

  if (!rawBase) {
    throw new Error(t('baseUrlError'));
  }

  const createUrl = rawBase.startsWith("http")
    ? `${rawBase}/api/stripe/connect/create-account`
    : `https://${rawBase}/api/stripe/connect/create-account`;
  const res = await fetch(createUrl, { method: "GET" });
  const data = await res.json();

  if (!res.ok || !data?.stripe_account_id) {
    throw new Error(t('stripeCreateError'));
  }

  await supabaseAdmin
    .from("clientes")
    .update({ stripe_account_id: data.stripe_account_id })
    .eq("id", id);

  redirect("/api/stripe/connect/onboarding");
}

interface ClientePageProps {
  params: Promise<{ id: string }>;
}

export default async function ClientePage({ params }: ClientePageProps) {
  const t = await getTranslations('owner.clientes');
  const tf = await getTranslations('owner.clientes.form');
  const tc = await getTranslations('common');
  const { id } = await params;

  const { data: cliente } = await supabaseAdmin
    .from("clientes")
    .select("*")
    .eq("id", id)
    .single();

  // Load client's destinations and bookings for AI context
  const { data: clientDestinos } = await supabaseAdmin
    .from("destinos")
    .select("nombre, precio, activo")
    .eq("cliente_id", id);

  const { data: clientReservas } = await supabaseAdmin
    .from("reservas")
    .select("id, precio, estado_pago")
    .eq("cliente_id", id);

  if (!cliente) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('clientNotFound')}</h1>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{t('editClient')}</h1>

      <form action={updateCliente} className="space-y-4 max-w-2xl">
        <input type="hidden" name="id" value={cliente.id} />

        <div>
          <label className="panel-label block mb-1">{tc('name')}</label>
          <input
            name="nombre"
            defaultValue={cliente.nombre ?? ""}
            className="w-full panel-input"
          />
        </div>
        <div>
          <label className="panel-label block mb-1">{t('domain')}</label>
          <input
            name="domain"
            defaultValue={cliente.domain ?? ""}
            className="w-full panel-input"
          />
        </div>
        <div>
          <label className="panel-label block mb-1">{tf('primaryColor')}</label>
          <input
            name="primary_color"
            defaultValue={cliente.primary_color ?? ""}
            className="w-full panel-input"
          />
        </div>
        <div>
          <label className="panel-label block mb-1">{tf('heroTitle')}</label>
          <input
            name="hero_title"
            defaultValue={cliente.hero_title ?? ""}
            className="w-full panel-input"
          />
        </div>
        <div>
          <label className="panel-label block mb-1">{tf('heroSubtitle')}</label>
          <textarea
            name="hero_subtitle"
            defaultValue={cliente.hero_subtitle ?? ""}
            className="w-full panel-input"
          />
        </div>
        <div>
          <label className="panel-label block mb-1">{tf('heroCta')}</label>
          <input
            name="hero_cta_text"
            defaultValue={cliente.hero_cta_text ?? ""}
            className="w-full panel-input"
          />
        </div>
        <div>
          <label className="panel-label block mb-1">{tc('plan')}</label>
          <select
            name="plan"
            defaultValue={cliente.plan ?? "start"}
            className="w-full panel-input"
          >
            <option value="start">Start</option>
            <option value="grow">Grow</option>
            <option value="pro">Pro</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="activo"
            defaultChecked={Boolean(cliente.activo)}
          />
          <label className="text-sm text-gray-700 dark:text-white/70">{tc('active')}</label>
        </div>

        <button type="submit" className="btn-primary">
          {tc('saveChanges')}
        </button>
      </form>

      {!cliente.stripe_account_id && (
        <form action={connectStripe} className="mt-6">
          <input type="hidden" name="id" value={cliente.id} />
          <ConnectStripeButton />
        </form>
      )}

      {/* AI Recommendations */}
      <div className="mt-8">
        <AIRecommendations
          clientData={`Agencia: ${cliente.nombre || "Sin nombre"}
Plan: ${cliente.plan || "Sin plan"}
Dominio: ${cliente.domain || "Sin dominio"}
Stripe: ${cliente.stripe_account_id ? "Conectado" : "No conectado"}
Suscripción: ${cliente.stripe_subscription_id ? "Activa" : "Inactiva"}
Destinos: ${(clientDestinos || []).map((d: any) => `${d.nombre} (${d.precio}€, ${d.activo ? "activo" : "inactivo"})`).join(", ") || "Ninguno"}
Reservas totales: ${clientReservas?.length || 0}
Reservas pagadas: ${clientReservas?.filter((r: any) => r.estado_pago === "pagado").length || 0}
Ingresos: ${clientReservas?.filter((r: any) => r.estado_pago === "pagado").reduce((s: number, r: any) => s + Number(r.precio), 0) || 0}€`}
        />
      </div>
    </div>
  );
}
