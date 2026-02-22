import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getTranslations } from 'next-intl/server';
import Image from "next/image";
import RiveAnimation from "@/components/ui/RiveAnimation";
import LanguageSelector from "@/components/ui/LanguageSelector";
import SubmitButton from "@/components/ui/SubmitButton";

async function handleLogin(formData: FormData) {
  "use server";

  const email = (formData.get("email") as string) || "";
  const password = (formData.get("password") as string) || "";

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    redirect("/admin/login?error=auth");
  }

  const { data: client } = await supabaseAdmin
    .from("clientes")
    .select("id")
    .eq("email", email)
    .single();

  if (!client) {
    redirect("/admin/login?error=client");
  }

  const cookieStore = await cookies();
  cookieStore.set("admin_session", "ok", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  cookieStore.set("cliente_id", client.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
    secure: process.env.NODE_ENV === "production",
  });

  redirect("/admin");
}

interface AdminLoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const { error } = await searchParams;
  const t = await getTranslations('auth.adminLogin');
  const tc = await getTranslations('common');

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Full-screen Rive background */}
      <RiveAnimation
        className="absolute inset-0 w-full h-full"
        fit="cover"
      />

      {/* Dark overlay for readability — pointer-events-none so Rive receives mouse events */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/40 pointer-events-none" />

      {/* Language selector — top end */}
      <div className="absolute top-4 end-4 z-20 pointer-events-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
          <LanguageSelector />
        </div>
      </div>

      {/* Welcome text — top center, in the "sky" */}
      <div className="absolute top-8 inset-x-0 z-10 flex flex-col items-center text-center pointer-events-none">
        <Image
          src="/logo.png"
          alt="DRB Agency"
          width={72}
          height={72}
          className="mb-4 drop-shadow-2xl"
        />
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white drop-shadow-2xl">
          {t('welcome')}{" "}
          <span className="bg-gradient-to-r from-drb-turquoise-200 to-drb-lime-300 bg-clip-text text-transparent" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.15)" }}>{t('brand')}</span>
        </h1>
        <p className="mt-3 text-base md:text-lg text-white/80 drop-shadow-lg font-medium">
          {t('tagline')}
        </p>
      </div>

      {/* Login form — right side overlay, pointer-events-none on wrapper so Rive tracks mouse */}
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
                {error === "client"
                  ? t('errorClient')
                  : t('errorAuth')}
              </div>
            )}

            <form action={handleLogin} className="space-y-4">
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
                />
              </div>

              <SubmitButton label={t('submit')} loadingLabel={tc('loading')} />
            </form>

            <p className="text-center text-sm text-white/50 mt-4">
              {t('noAccount')}{" "}
              <a href="/admin/register" className="text-drb-turquoise-400 hover:text-drb-turquoise-300 transition-colors font-medium">
                {t('register')}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
