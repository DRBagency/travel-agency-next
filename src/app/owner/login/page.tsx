import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { getTranslations } from 'next-intl/server';
import Image from "next/image";
import RiveAnimation from "@/components/ui/RiveAnimation";
import LanguageSelector from "@/components/ui/LanguageSelector";

function getAllowedOwnerEmail() {
  return (process.env.OWNER_EMAIL || "").trim().toLowerCase();
}

async function handleOwnerLogin(formData: FormData) {
  "use server";

  const email = (formData.get("email") as string) || "";
  const password = (formData.get("password") as string) || "";
  const allowed = getAllowedOwnerEmail();

  if (!allowed || email.toLowerCase() !== allowed) {
    redirect("/owner/login?error=owner");
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    redirect("/owner/login?error=auth");
  }

  const cookieStore = await cookies();
  cookieStore.set("owner", "true", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
    secure: process.env.NODE_ENV === "production",
  });
  cookieStore.set("owner_email", email.toLowerCase(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
    secure: process.env.NODE_ENV === "production",
  });

  redirect("/owner");
}

interface OwnerLoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function OwnerLoginPage({
  searchParams,
}: OwnerLoginPageProps) {
  const { error } = await searchParams;
  const t = await getTranslations('auth.ownerLogin');
  const tc = await getTranslations('common');

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Full-screen Rive background */}
      <RiveAnimation
        className="absolute inset-0 w-full h-full"
        fit="cover"
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/40" />

      {/* Language selector — top end */}
      <div className="absolute top-4 end-4 z-20">
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
          <LanguageSelector />
        </div>
      </div>

      {/* Welcome text — top center, in the "sky" */}
      <div className="absolute top-8 inset-x-0 z-10 flex flex-col items-center text-center pointer-events-none">
        <Image
          src="/logo.png"
          alt="DRB Agency"
          width={48}
          height={48}
          className="mb-3 drop-shadow-lg"
        />
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
          {t('welcome')}{" "}
          <span className="bg-gradient-to-r from-drb-turquoise-400 to-drb-lime-400 bg-clip-text text-transparent">
            {t('brand')}
          </span>
        </h1>
        <p className="mt-2 text-sm md:text-base text-white/70 drop-shadow">
          {t('tagline')}
        </p>
      </div>

      {/* Login form — right side overlay */}
      <div className="relative z-10 min-h-screen flex items-center justify-center lg:justify-end px-4 lg:pe-16 lg:ps-0">
        <div className="w-full max-w-sm">
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
                {error === "owner"
                  ? t('errorOwner')
                  : t('errorAuth')}
              </div>
            )}

            <form action={handleOwnerLogin} className="space-y-4">
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

              <button
                type="submit"
                className="w-full rounded-xl bg-drb-turquoise-500 hover:bg-drb-turquoise-600 text-white font-bold py-3 transition-colors shadow-lg shadow-drb-turquoise-500/30"
              >
                {t('submit')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
