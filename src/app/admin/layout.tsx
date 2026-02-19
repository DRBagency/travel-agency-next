import { ReactNode } from "react";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";
import AdminShell from "@/components/admin/AdminShell";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const cookieStore = await cookies();
  const clienteId = cookieStore.get("cliente_id")?.value;

  if (!clienteId) {
    return <>{children}</>;
  }

  const { data: client } = await supabaseAdmin
    .from("clientes")
    .select("id, nombre, email, plan, primary_color, logo_url, stripe_subscription_id")
    .eq("id", clienteId)
    .single();

  if (!client) {
    return <>{children}</>;
  }

  return (
    <AdminShell
      clientName={client.nombre}
      clientEmail={client.email}
      clienteId={client.id}
      plan={client.plan}
      primaryColor={client.primary_color}
      logoUrl={client.logo_url}
      subscriptionActive={Boolean(client.stripe_subscription_id)}
    >
      {children}
    </AdminShell>
  );
}
