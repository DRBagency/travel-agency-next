import { createClient } from "@supabase/supabase-js";
import { subMonths, format, startOfMonth, endOfMonth } from "date-fns";
import { es } from "date-fns/locale";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PLAN_PRICES: Record<string, number> = {
  start: 29,
  grow: 59,
  pro: 99,
};

export interface MonthlyComparison {
  month: string;
  mrr: number;
  comisiones: number;
  reservas: number;
}

export interface ProjectionPoint {
  month: string;
  mrr: number;
  tipo: "actual" | "proyectado";
}

export async function getComparisonData() {
  try {
    const now = new Date();

    // Last 6 months of real data
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(now, 5 - i);
      return {
        month: format(date, "MMM yy", { locale: es }),
        start: startOfMonth(date).toISOString(),
        end: endOfMonth(date).toISOString(),
      };
    });

    const comparison: MonthlyComparison[] = await Promise.all(
      months.map(async (m) => {
        // MRR: count active subscribers as of end of month
        const { data: clientes } = await supabaseAdmin
          .from("clientes")
          .select("plan")
          .not("stripe_subscription_id", "is", null)
          .lte("created_at", m.end);

        const mrr =
          clientes?.reduce(
            (sum, c) => sum + (PLAN_PRICES[c.plan] || 0),
            0
          ) || 0;

        // Reservas + comisiones in this month
        const { data: reservas } = await supabaseAdmin
          .from("reservas")
          .select("precio, cliente_id, clientes!inner(commission_rate)")
          .eq("estado_pago", "pagado")
          .gte("created_at", m.start)
          .lte("created_at", m.end);

        const reservaCount = reservas?.length || 0;
        const comisiones =
          reservas?.reduce((sum, r) => {
            const rate =
              (r.clientes as unknown as { commission_rate: number })
                ?.commission_rate || 0;
            return sum + (r.precio || 0) * rate;
          }, 0) || 0;

        return {
          month: m.month,
          mrr,
          comisiones: Math.round(comisiones * 100) / 100,
          reservas: reservaCount,
        };
      })
    );

    // Projection: linear regression on MRR for 3 future months
    const mrrValues = comparison.map((c) => c.mrr);
    const n = mrrValues.length;
    const avgGrowth =
      n >= 2 ? (mrrValues[n - 1] - mrrValues[0]) / (n - 1) : 0;

    const projection: ProjectionPoint[] = [
      // Include actual data
      ...comparison.map((c) => ({
        month: c.month,
        mrr: c.mrr,
        tipo: "actual" as const,
      })),
      // Add 3 projected months
      ...Array.from({ length: 3 }, (_, i) => {
        const futureDate = subMonths(now, -(i + 1));
        return {
          month: format(futureDate, "MMM yy", { locale: es }),
          mrr: Math.max(0, Math.round(mrrValues[n - 1] + avgGrowth * (i + 1))),
          tipo: "proyectado" as const,
        };
      }),
    ];

    return { comparison, projection };
  } catch (error) {
    console.error("Error fetching comparison data:", error);
    return {
      comparison: [],
      projection: [],
    };
  }
}
