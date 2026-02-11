import { supabaseAdmin } from "@/lib/supabase-server";

const PLAN_PRICES: Record<string, number> = {
  start: 29,
  grow: 59,
  pro: 99,
};

export async function getDashboardMetrics() {
  try {
    // Total de clientes activos
    const { count: totalClientes } = await supabaseAdmin
      .from("clientes")
      .select("*", { count: "exact", head: true })
      .eq("activo", true);

    // Clientes con suscripción activa
    const { count: clientesConSuscripcion } = await supabaseAdmin
      .from("clientes")
      .select("*", { count: "exact", head: true })
      .not("stripe_subscription_id", "is", null);

    // Calcular MRR (Monthly Recurring Revenue)
    const { data: clientesPlanes } = await supabaseAdmin
      .from("clientes")
      .select("plan")
      .not("stripe_subscription_id", "is", null);

    const mrr =
      clientesPlanes?.reduce((sum, cliente) => {
        const precio =
          PLAN_PRICES[
            (cliente.plan as string)?.toLowerCase() ?? ""
          ] || 0;
        return sum + precio;
      }, 0) || 0;

    // Total de reservas del mes actual
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    const { count: reservasMes } = await supabaseAdmin
      .from("reservas")
      .select("*", { count: "exact", head: true })
      .gte("created_at", inicioMes.toISOString());

    // Comisiones generadas este mes
    const { data: reservasMesData } = await supabaseAdmin
      .from("reservas")
      .select("precio, cliente_id, clientes!inner(commission_rate)")
      .eq("estado_pago", "pagado")
      .gte("created_at", inicioMes.toISOString());

    const comisionesMes =
      reservasMesData?.reduce((sum, reserva: any) => {
        const comision =
          (reserva.precio || 0) *
          (reserva.clientes?.commission_rate || 0);
        return sum + comision;
      }, 0) || 0;

    // Últimos 5 clientes creados
    const { data: ultimosClientes } = await supabaseAdmin
      .from("clientes")
      .select(
        "id, nombre, domain, plan, created_at, activo, stripe_subscription_id"
      )
      .order("created_at", { ascending: false })
      .limit(5);

    return {
      totalClientes: totalClientes || 0,
      clientesConSuscripcion: clientesConSuscripcion || 0,
      mrr,
      reservasMes: reservasMes || 0,
      comisionesMes,
      ultimosClientes: ultimosClientes || [],
    };
  } catch (error) {
    console.error("❌ Error fetching dashboard metrics:", error);
    return {
      totalClientes: 0,
      clientesConSuscripcion: 0,
      mrr: 0,
      reservasMes: 0,
      comisionesMes: 0,
      ultimosClientes: [],
    };
  }
}
