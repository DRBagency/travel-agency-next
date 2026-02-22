import { supabaseAdmin } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getTranslations, getLocale } from 'next-intl/server';
import ConnectStripeButton from "./ConnectStripeButton";
import AIRecommendations from "@/components/ai/AIRecommendations";
import ClienteTabs from "./ClienteTabs";
import CRMTab from "./CRMTab";
import { MapPin, ShoppingBag } from "lucide-react";

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

  const host = (await headers()).get("host") ?? "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const createUrl = `${baseUrl}/api/stripe/connect/create-account`;
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
  const locale = await getLocale();
  const { id } = await params;

  const { data: cliente } = await supabaseAdmin
    .from("clientes")
    .select("*")
    .eq("id", id)
    .single();

  // Load client's destinations and bookings
  const { data: clientDestinos } = await supabaseAdmin
    .from("destinos")
    .select("id, nombre, precio, activo, imagen_url, created_at")
    .eq("cliente_id", id)
    .order("created_at", { ascending: false });

  const { data: clientReservas } = await supabaseAdmin
    .from("reservas")
    .select("id, nombre, email, destino, precio, estado_pago, personas, created_at")
    .eq("cliente_id", id)
    .order("created_at", { ascending: false });

  const { data: clientActivities } = await supabaseAdmin
    .from("client_activities")
    .select("id, client_id, type, content, metadata, created_at")
    .eq("client_id", id)
    .order("created_at", { ascending: false });

  if (!cliente) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('clientNotFound')}</h1>
      </div>
    );
  }

  const destinos = clientDestinos || [];
  const reservas = clientReservas || [];
  const paidReservas = reservas.filter((r: any) => r.estado_pago === "pagado");
  const totalRevenue = paidReservas.reduce((s: number, r: any) => s + Number(r.precio), 0);

  // Info tab content
  const infoTab = (
    <div className="space-y-6">
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
    </div>
  );

  // Destinations tab content
  const destinationsTab = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400 dark:text-white/40">
          {t('destinationsCount', { count: destinos.length })}
        </p>
      </div>

      {destinos.length === 0 ? (
        <div className="panel-card p-12 text-center">
          <MapPin className="w-10 h-10 text-gray-300 dark:text-white/20 mx-auto mb-3" />
          <p className="text-gray-400 dark:text-white/40">{t('noDestinations')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {destinos.map((d: any) => (
            <div key={d.id} className="panel-card overflow-hidden">
              <div className="relative h-36 bg-gray-100 dark:bg-white/[0.04]">
                {d.imagen_url ? (
                  <img
                    src={d.imagen_url}
                    alt={d.nombre ?? ""}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-gray-300 dark:text-white/20" />
                  </div>
                )}
                <div className="absolute top-2 end-2">
                  {d.activo ? (
                    <span className="badge-success text-xs">{tc('active')}</span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-gray-800/70 text-white/80 px-2 py-0.5 text-xs backdrop-blur-sm">
                      {tc('inactive')}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  {d.nombre || "—"}
                </h3>
                <p className="text-lg font-bold text-drb-turquoise-600 dark:text-drb-turquoise-400 mt-1">
                  {d.precio ?? 0} €
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Bookings tab content
  const bookingsTab = (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm text-gray-400 dark:text-white/40">
          {t('bookingsCount', { count: reservas.length })}
        </p>
        <div className="flex gap-4 text-sm">
          <div className="panel-card px-4 py-2">
            <span className="text-gray-400 dark:text-white/40">{tc('status')}: </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {paidReservas.length} pagadas
            </span>
          </div>
          <div className="panel-card px-4 py-2">
            <span className="text-gray-400 dark:text-white/40">{t('revenue')}: </span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {totalRevenue} €
            </span>
          </div>
        </div>
      </div>

      {reservas.length === 0 ? (
        <div className="panel-card p-12 text-center">
          <ShoppingBag className="w-10 h-10 text-gray-300 dark:text-white/20 mx-auto mb-3" />
          <p className="text-gray-400 dark:text-white/40">{t('noBookings')}</p>
        </div>
      ) : (
        <div className="panel-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/[0.06] bg-gray-50/80 dark:bg-white/[0.02]">
                  <th className="px-6 py-3 text-start text-xs font-medium text-gray-400 dark:text-white/40 uppercase">{tc('date')}</th>
                  <th className="px-6 py-3 text-start text-xs font-medium text-gray-400 dark:text-white/40 uppercase">{tc('name')}</th>
                  <th className="px-6 py-3 text-start text-xs font-medium text-gray-400 dark:text-white/40 uppercase">{tc('email')}</th>
                  <th className="px-6 py-3 text-start text-xs font-medium text-gray-400 dark:text-white/40 uppercase">{tc('price')}</th>
                  <th className="px-6 py-3 text-start text-xs font-medium text-gray-400 dark:text-white/40 uppercase">{tc('status')}</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((r: any) => (
                  <tr key={r.id} className="table-row">
                    <td className="px-6 py-3 text-sm text-gray-500 dark:text-white/50">
                      {new Date(r.created_at).toLocaleDateString(locale)}
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-white">{r.nombre}</td>
                    <td className="px-6 py-3 text-sm text-gray-400 dark:text-white/40">{r.email}</td>
                    <td className="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white">{r.precio} €</td>
                    <td className="px-6 py-3">
                      <span className={
                        r.estado_pago === "pagado"
                          ? "badge-success"
                          : r.estado_pago === "pendiente"
                            ? "badge-warning"
                            : "badge-info"
                      }>
                        {r.estado_pago}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  // AI tab content
  const aiTab = (
    <AIRecommendations
      clientData={`Agencia: ${cliente.nombre || "Sin nombre"}
Plan: ${cliente.plan || "Sin plan"}
Dominio: ${cliente.domain || "Sin dominio"}
Stripe: ${cliente.stripe_account_id ? "Conectado" : "No conectado"}
Suscripción: ${cliente.stripe_subscription_id ? "Activa" : "Inactiva"}
Destinos: ${destinos.map((d: any) => `${d.nombre} (${d.precio}€, ${d.activo ? "activo" : "inactivo"})`).join(", ") || "Ninguno"}
Reservas totales: ${reservas.length}
Reservas pagadas: ${paidReservas.length}
Ingresos: ${totalRevenue}€`}
    />
  );

  // CRM tab content
  const crmTab = (
    <CRMTab
      clientId={cliente.id}
      notes={cliente.client_notes || ""}
      leadStatus={cliente.lead_status || "lead"}
      activities={(clientActivities || []) as Array<{
        id: string;
        client_id: string;
        type: string;
        content: string;
        metadata: Record<string, unknown>;
        created_at: string;
      }>}
    />
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('editClient')}</h1>
          <p className="text-gray-400 dark:text-white/40 text-sm mt-1">
            {cliente.nombre} · {cliente.domain || "—"} · <span className="badge-info">{cliente.plan || tc('noPlan')}</span>
          </p>
        </div>
      </div>

      {/* Tabs */}
      <ClienteTabs
        infoTab={infoTab}
        destinationsTab={destinationsTab}
        bookingsTab={bookingsTab}
        aiTab={aiTab}
        crmTab={crmTab}
        destinationsCount={destinos.length}
        bookingsCount={reservas.length}
      />
    </div>
  );
}
