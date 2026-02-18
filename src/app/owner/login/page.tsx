import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { getTranslations } from 'next-intl/server';

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 dark:border-white/15 bg-white dark:bg-white/10 shadow-card dark:shadow-none backdrop-blur-md p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-drb-turquoise-500 to-drb-turquoise-600" />
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
              {t('title')}
            </h1>
            <p className="text-gray-500 dark:text-white/60 text-sm">
              {t('subtitle')}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 dark:border-red-500/40 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-200">
            {error === "owner"
              ? t('errorOwner')
              : t('errorAuth')}
          </div>
        )}

        <form action={handleOwnerLogin} className="space-y-4">
          <div>
            <label className="panel-label block mb-1">
              {tc('email')}
            </label>
            <input
              name="email"
              type="email"
              className="panel-input w-full"
              placeholder="owner@agencia.com"
              required
            />
          </div>
          <div>
            <label className="panel-label block mb-1">
              {tc('password')}
            </label>
            <input
              name="password"
              type="password"
              className="panel-input w-full"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-drb-turquoise-500 hover:bg-drb-turquoise-600 text-white font-bold py-3 transition-colors"
          >
            {t('submit')}
          </button>
        </form>
      </div>
    </div>
  );
}
