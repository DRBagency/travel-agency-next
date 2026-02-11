import { createClient } from "@supabase/supabase-js";
import { subMonths, format, startOfMonth, endOfMonth } from "date-fns";
import { es } from "date-fns/locale";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getChartData() {
  try {
    // Últimos 6 meses
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), 5 - i);
      return {
        month: format(date, "MMM", { locale: es }),
        start: startOfMonth(date).toISOString(),
        end: endOfMonth(date).toISOString(),
      };
    });

    // Clientes nuevos por mes
    const clientesPorMes = await Promise.all(
      months.map(async (m) => {
        const { count } = await supabaseAdmin
          .from("clientes")
          .select("*", { count: "exact", head: true })
          .gte("created_at", m.start)
          .lte("created_at", m.end);

        return { month: m.month, clientes: count || 0 };
      })
    );

    // MRR por mes
    const PLAN_PRICES = { start: 29, grow: 59, pro: 99 };

    const mrrPorMes = await Promise.all(
      months.map(async (m) => {
        const { data: clientes } = await supabaseAdmin
          .from("clientes")
          .select("plan")
          .not("stripe_subscription_id", "is", null)
          .lte("created_at", m.end);

        const mrr =
          clientes?.reduce((sum, c) => {
            return sum + (PLAN_PRICES[c.plan as keyof typeof PLAN_PRICES] || 0);
          }, 0) || 0;

        return { month: m.month, mrr };
      })
    );

    // Reservas por mes
    const reservasPorMes = await Promise.all(
      months.map(async (m) => {
        const { count } = await supabaseAdmin
          .from("reservas")
          .select("*", { count: "exact", head: true })
          .gte("created_at", m.start)
          .lte("created_at", m.end);

        return { month: m.month, reservas: count || 0 };
      })
    );

    return {
      clientesPorMes,
      mrrPorMes,
      reservasPorMes,
    };
  } catch (error) {
    console.error("Error fetching chart data:", error);
    return {
      clientesPorMes: [],
      mrrPorMes: [],
      reservasPorMes: [],
    };
  }
}
