import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getTranslations } from 'next-intl/server';
import Image from "next/image";
import RiveAnimation from "@/components/ui/RiveAnimation";
import LanguageSelector from "@/components/ui/LanguageSelector";
import SubmitButton from "@/components/ui/SubmitButton";

async function handleRegister(formData: FormData) {
  "use server";

  const nombre = (formData.get("nombre") as string)?.trim() || "";
  const email = (formData.get("email") as string)?.trim() || "";
  const password = (formData.get("password") as string) || "";

  if (!nombre || !email || password.length < 6) {
    redirect("/admin/register?error=general");
  }

  // Generate slug from nombre
  const slug = nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  // Create auth user
  const { error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    if (authError.message?.includes("already been registered")) {
      redirect("/admin/register?error=exists");
    }
    redirect("/admin/register?error=general");
  }

  // Insert into clientes
  const { data: cliente, error: clienteError } = await supabaseAdmin
    .from("clientes")
    .insert({ nombre, email, slug })
    .select("id")
    .single();

  if (clienteError || !cliente) {
    if (clienteError?.code === "23505") {
      redirect("/admin/register?error=slug");
    }
    redirect("/admin/register?error=general");
  }

  const clienteId = cliente.id;

  // Auto-create demo data (same pattern as owner/clientes/nuevo/actions.ts)
  await supabaseAdmin.from("opiniones").insert({
    cliente_id: clienteId,
    nombre: "Cliente Demo",
    ciudad: "Madrid",
    texto: "Excelente experiencia, todo fue rápido y claro.",
    rating: 5,
    activo: true,
  });

  await supabaseAdmin.from("paginas_legales").insert([
    {
      cliente_id: clienteId,
      titulo: "Aviso legal",
      slug: "aviso-legal",
      contenido: "<h2>Aviso legal</h2><p>Contenido pendiente.</p>",
      activo: true,
    },
    {
      cliente_id: clienteId,
      titulo: "Política de privacidad",
      slug: "privacidad",
      contenido: "<h2>Política de privacidad</h2><p>Contenido pendiente.</p>",
      activo: true,
    },
    {
      cliente_id: clienteId,
      titulo: "Política de cookies",
      slug: "cookies",
      contenido: "<h2>Política de cookies</h2><p>Contenido pendiente.</p>",
      activo: true,
    },
  ]);

  await supabaseAdmin.from("email_templates").insert({
    cliente_id: clienteId,
    tipo: "reserva_cliente",
    subject: "✅ Reserva confirmada",
    html_body:
      "<h1>Reserva confirmada</h1><p>Hola {{customerName}}, tu reserva a {{destination}} está confirmada.</p>",
    cta_text: "Contactar con la agencia",
    cta_url: "mailto:{{contactEmail}}",
    activo: true,
  });

  // Set cookies (same pattern as login)
  const cookieStore = await cookies();
  cookieStore.set("admin_session", "ok", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  cookieStore.set("cliente_id", clienteId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
    secure: process.env.NODE_ENV === "production",
  });

  redirect("/admin/onboarding");
}

interface AdminRegisterPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function AdminRegisterPage({
  searchParams,
}: AdminRegisterPageProps) {
  const { error } = await searchParams;
  const t = await getTranslations('auth.adminRegister');
  const tc = await getTranslations('common');

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Full-screen Rive background */}
      <RiveAnimation
        className="absolute inset-0 w-full h-full"
        fit="cover"
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/40 pointer-events-none" />

      {/* Language selector — top end */}
      <div className="absolute top-4 end-4 z-20 pointer-events-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
          <LanguageSelector />
        </div>
      </div>

      {/* Welcome text — top center */}
      <div className="absolute top-8 inset-x-0 z-10 flex flex-col items-center text-center pointer-events-none">
        <Image
          src="/logo.png"
          alt="DRB Agency"
          width={72}
          height={72}
          className="mb-4 drop-shadow-2xl"
        />
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white drop-shadow-2xl">
          {t('heroTitle')}{" "}
          <span className="bg-gradient-to-r from-drb-turquoise-200 to-drb-lime-300 bg-clip-text text-transparent" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.15)" }}>{t('heroBrand')}</span>
        </h1>
        <p className="mt-3 text-base md:text-lg text-white/80 drop-shadow-lg font-medium">
          {t('subtitle')}
        </p>
      </div>

      {/* Register form — right side overlay */}
      <div className="relative z-10 min-h-screen flex items-center justify-center lg:justify-end px-4 lg:pe-16 lg:ps-0 pointer-events-none">
        <div className="w-full max-w-sm pointer-events-auto">
          <div className="rounded-3xl border border-white/20 bg-black/40 backdrop-blur-xl p-8 shadow-2xl">
            <div className="mb-6">
              <h2 className="font-display text-xl font-bold text-white">
                {t('title')}
              </h2>
              <p className="text-white/60 text-sm">
                {t('subtitle')}
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-400/40 bg-red-500/20 backdrop-blur px-4 py-3 text-sm text-red-200">
                {error === "exists"
                  ? t('errorExists')
                  : error === "slug"
                  ? t('errorSlug')
                  : t('errorGeneral')}
              </div>
            )}

            <form action={handleRegister} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-white/80">
                  {tc('name')}
                </label>
                <input
                  name="nombre"
                  type="text"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-drb-turquoise-500/50 focus:border-drb-turquoise-500 transition-colors"
                  placeholder={t('namePlaceholder')}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-white/80">
                  {tc('email')}
                </label>
                <input
                  name="email"
                  type="email"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-drb-turquoise-500/50 focus:border-drb-turquoise-500 transition-colors"
                  placeholder={t('emailPlaceholder')}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-white/80">
                  {tc('password')}
                </label>
                <input
                  name="password"
                  type="password"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-drb-turquoise-500/50 focus:border-drb-turquoise-500 transition-colors"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              <SubmitButton label={t('submit')} loadingLabel={tc('loading')} />
            </form>

            <p className="text-center text-sm text-white/50 mt-4">
              {t('hasAccount')}{" "}
              <a href="/admin/login" className="text-drb-turquoise-400 hover:text-drb-turquoise-300 transition-colors font-medium">
                {t('login')}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
