import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PLAN_PRICES = {
  start: 29,
  grow: 59,
  pro: 99,
};

export async function getMonetizationData() {
  try {
    // Clientes por plan
    const { data: clientesPorPlan } = await supabaseAdmin
      .from("clientes")
      .select("plan, stripe_subscription_id")
      .not("stripe_subscription_id", "is", null);

    const desglosePlanes = {
      start: { count: 0, mrr: 0 },
      grow: { count: 0, mrr: 0 },
      pro: { count: 0, mrr: 0 },
    };

    clientesPorPlan?.forEach((cliente) => {
      const plan = cliente.plan as keyof typeof PLAN_PRICES;
      if (plan && desglosePlanes[plan]) {
        desglosePlanes[plan].count++;
        desglosePlanes[plan].mrr += PLAN_PRICES[plan];
      }
    });

    // Comisiones por cliente (último mes)
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    const { data: reservasPorCliente } = await supabaseAdmin
      .from("reservas")
      .select("precio, cliente_id, clientes!inner(nombre, commission_rate)")
      .eq("estado_pago", "pagado")
      .gte("created_at", inicioMes.toISOString());

    const comisionesPorCliente: Record<string, { nombre: string; total: number; count: number }> = {};

    reservasPorCliente?.forEach((reserva) => {
      const clienteId = reserva.cliente_id;
      const cliente = reserva.clientes as unknown as { nombre: string; commission_rate: number } | null;
      const comision = (reserva.precio || 0) * (cliente?.commission_rate || 0);

      if (!comisionesPorCliente[clienteId]) {
        comisionesPorCliente[clienteId] = {
          nombre: cliente?.nombre || "Sin nombre",
          total: 0,
          count: 0,
        };
      }

      comisionesPorCliente[clienteId].total += comision;
      comisionesPorCliente[clienteId].count++;
    });

    const comisionesArray = Object.entries(comisionesPorCliente)
      .map(([id, data]) => ({ clienteId: id, ...data }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    // MRR total
    const mrrTotal = Object.values(desglosePlanes).reduce((sum, plan) => sum + plan.mrr, 0);

    return {
      desglosePlanes,
      mrrTotal,
      comisionesPorCliente: comisionesArray,
    };
  } catch (error) {
    console.error("Error fetching monetization data:", error);
    return {
      desglosePlanes: {
        start: { count: 0, mrr: 0 },
        grow: { count: 0, mrr: 0 },
        pro: { count: 0, mrr: 0 },
      },
      mrrTotal: 0,
      comisionesPorCliente: [],
    };
  }
}
