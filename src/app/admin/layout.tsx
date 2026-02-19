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
    .select("id, nombre, email, plan, primary_color, logo_url, profile_photo, contact_phone, stripe_subscription_id")
    .eq("id", clienteId)
    .single();

  if (!client) {
    return <>{children}</>;
  }

  // Build agency context for Eden AI assistant
  const [{ data: destinos }, { data: reservas }] = await Promise.all([
    supabaseAdmin
      .from("destinos")
      .select("nombre, descripcion, precio, activo")
      .eq("cliente_id", clienteId),
    supabaseAdmin
      .from("reservas")
      .select("id, destino, precio, estado_pago")
      .eq("cliente_id", clienteId),
  ]);

  const destinosList = (destinos || [])
    .map((d: any) => `- ${d.nombre}: ${d.precio}€ (${d.activo ? "activo" : "inactivo"})`)
    .join("\n");

  const totalReservas = reservas?.length || 0;
  const pagadas = reservas?.filter((r: any) => r.estado_pago === "pagado") || [];
  const totalIngresos = pagadas.reduce((s: number, r: any) => s + Number(r.precio), 0);

  const agencyContext = `
Agencia: ${client.nombre}
Plan: ${client.plan || "No definido"}
Destinos activos:
${destinosList || "Ninguno"}
Reservas totales: ${totalReservas}
Reservas pagadas: ${pagadas.length}
Ingresos totales: ${totalIngresos}€
`.trim();

  return (
    <AdminShell
      clientName={client.nombre}
      clientEmail={client.email}
      clienteId={client.id}
      plan={client.plan}
      primaryColor={client.primary_color}
      logoUrl={client.logo_url}
      profilePhoto={client.profile_photo}
      contactPhone={client.contact_phone}
      subscriptionActive={Boolean(client.stripe_subscription_id)}
      agencyContext={agencyContext}
    >
      {children}
    </AdminShell>
  );
}
