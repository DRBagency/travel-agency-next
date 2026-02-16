import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

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

  return (
    <div className="-mt-20 min-h-screen bg-gradient-to-b from-drb-turquoise-800 via-drb-turquoise-700 to-drb-turquoise-600 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/25 bg-white/15 backdrop-blur-md p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-drb-turquoise-400 to-drb-lime-500" />
          <div>
            <h1 className="font-display text-2xl font-bold">
              Acceso Owner
            </h1>
            <p className="text-white/60 text-sm">
              Inicia sesión para gestionar clientes.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error === "owner"
              ? "Este email no tiene acceso de owner."
              : "Credenciales incorrectas. Inténtalo de nuevo."}
          </div>
        )}

        <form action={handleOwnerLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-white/70 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              className="w-full rounded-xl border border-white/30 bg-white/95 px-3 py-2.5 text-gray-900 placeholder:text-gray-400"
              placeholder="owner@agencia.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">
              Contraseña
            </label>
            <input
              name="password"
              type="password"
              className="w-full rounded-xl border border-white/30 bg-white/95 px-3 py-2.5 text-gray-900 placeholder:text-gray-400"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-drb-lime-500 hover:bg-drb-lime-400 text-drb-turquoise-900 font-bold py-3 transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
