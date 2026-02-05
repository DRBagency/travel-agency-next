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
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="font-display text-3xl font-bold mb-2">
          Acceso al panel
        </h1>
        <p className="text-white/60 mb-6">
          Introduce la contraseña para continuar.
        </p>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error === "client"
              ? "No se encontró un cliente con este email."
              : "Credenciales incorrectas. Inténtalo de nuevo."}
          </div>
        )}

        <form action={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-white/70 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white"
              placeholder="email@agencia.com"
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
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-white text-slate-950 font-semibold py-3"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
