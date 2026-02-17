import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase-server";

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 dark:border-white/15 bg-white dark:bg-white/10 shadow-card dark:shadow-none backdrop-blur-md p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600" />
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
              Acceso al panel
            </h1>
            <p className="text-gray-500 dark:text-white/60 text-sm">
              Introduce tus credenciales para continuar.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 dark:border-red-500/40 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-200">
            {error === "client"
              ? "No se encontró un cliente con este email."
              : "Credenciales incorrectas. Inténtalo de nuevo."}
          </div>
        )}

        <form action={handleLogin} className="space-y-4">
          <div>
            <label className="panel-label block mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              className="panel-input w-full"
              placeholder="email@agencia.com"
              required
            />
          </div>
          <div>
            <label className="panel-label block mb-1">
              Contraseña
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
            className="w-full rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
