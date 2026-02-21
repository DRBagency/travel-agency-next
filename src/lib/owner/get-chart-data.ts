import { createClient } from "@supabase/supabase-js";
import { subWeeks, format, startOfWeek, endOfWeek } from "date-fns";
import { es, enUS, ar } from "date-fns/locale";
import type { Locale } from "date-fns";

const dateFnsLocales: Record<string, Locale> = { es, en: enUS, ar };

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getChartData(locale: string = 'es') {
  const dfLocale = dateFnsLocales[locale] || es;
  try {
    // Últimas 8 semanas
    const weeks = Array.from({ length: 8 }, (_, i) => {
      const date = subWeeks(new Date(), 7 - i);
      const wStart = startOfWeek(date, { weekStartsOn: 1 });
      const wEnd = endOfWeek(date, { weekStartsOn: 1 });
      return {
        label: format(wStart, "dd MMM", { locale: dfLocale }),
        start: wStart.toISOString(),
        end: wEnd.toISOString(),
      };
    });

    // Clientes nuevos por semana
    const clientesPorMes = await Promise.all(
      weeks.map(async (w) => {
        const { count } = await supabaseAdmin
          .from("clientes")
          .select("*", { count: "exact", head: true })
          .gte("created_at", w.start)
          .lte("created_at", w.end);

        return { month: w.label, clientes: count || 0 };
      })
    );

    // MRR por semana
    const PLAN_PRICES = { start: 29, grow: 59, pro: 99 };

    const mrrPorMes = await Promise.all(
      weeks.map(async (w) => {
        const { data: clientes } = await supabaseAdmin
          .from("clientes")
          .select("plan")
          .not("stripe_subscription_id", "is", null)
          .lte("created_at", w.end);

        const mrr =
          clientes?.reduce((sum, c) => {
            return sum + (PLAN_PRICES[c.plan as keyof typeof PLAN_PRICES] || 0);
          }, 0) || 0;

        return { month: w.label, mrr };
      })
    );

    // Reservas por semana
    const reservasPorMes = await Promise.all(
      weeks.map(async (w) => {
        const { count } = await supabaseAdmin
          .from("reservas")
          .select("*", { count: "exact", head: true })
          .gte("created_at", w.start)
          .lte("created_at", w.end);

        return { month: w.label, reservas: count || 0 };
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
