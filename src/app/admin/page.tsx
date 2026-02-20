import { supabaseAdmin } from "@/lib/supabase-server";
import { requireAdminClient } from "@/lib/requireAdminClient";
import KPICard from "@/components/ui/KPICard";
import { ReservasChart, IngresosChart, RevenueProjectionChart, DestinosChart } from "@/components/admin/AdminAnalyticsCharts";
import {
  PremiumGreeting,
  StaggeredGrid,
  StaggeredItem,
  LatestBookings,
} from "@/components/admin/AdminDashboardClient";
import UpcomingEventsWidget from "@/components/admin/UpcomingEventsWidget";
import RecentMessagesWidget from "@/components/admin/RecentMessagesWidget";
import DestinationsMapWrapper from "@/components/admin/DestinationsMapWrapper";
import { subMonths, addMonths, format, startOfMonth, endOfMonth } from "date-fns";
import { getTranslations, getLocale } from 'next-intl/server';
import {
  DollarSign,
  ShoppingBag,
  Ticket,
  Map,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const client = await requireAdminClient();
  const t = await getTranslations('admin.dashboard');
  const tc = await getTranslations('common');
  const locale = await getLocale();

  /* Métricas de reservas */
  const { data: reservas } = await supabaseAdmin
    .from("reservas")
    .select("id, precio, estado_pago, created_at, destino, nombre")
    .eq("cliente_id", client.id)
    .order("created_at", { ascending: false });

  /* Destinos activos */
  const { count: destinosActivos } = await supabaseAdmin
    .from("destinos")
    .select("id", { count: "exact", head: true })
    .eq("cliente_id", client.id)
    .eq("activo", true);

  /* Upcoming calendar events (next 5) */
  const { data: upcomingEvents } = await supabaseAdmin
    .from("calendar_events")
    .select("id, title, start_time, end_time, all_day, description, color")
    .eq("cliente_id", client.id)
    .gte("start_time", new Date().toISOString())
    .order("start_time", { ascending: true })
    .limit(3);

  /* Destinos with coordinates (for map) */
  const { data: destinosConCoords } = await supabaseAdmin
    .from("destinos")
    .select("id, nombre, precio, latitude, longitude, imagen_url")
    .eq("cliente_id", client.id)
    .eq("activo", true)
    .not("latitude", "is", null)
    .not("longitude", "is", null);

  /* Recent contact messages (last 5) */
  const { data: recentMessages } = await supabaseAdmin
    .from("contact_messages")
    .select("id, sender_name, sender_email, message, read, created_at")
    .eq("cliente_id", client.id)
    .order("created_at", { ascending: false })
    .limit(3);

  const reservasSafe = reservas ?? [];
  const pagadas = reservasSafe.filter((r) => r.estado_pago === "pagado");
  const totalFacturado = pagadas.reduce((sum, r) => sum + Number(r.precio), 0);
  const numeroReservas = pagadas.length;
  const ticketMedio = numeroReservas > 0 ? Math.round(totalFacturado / numeroReservas) : 0;

  /* Chart data — últimos 6 meses */
  const now = new Date();
  const reservasChartData: { month: string; reservas: number }[] = [];
  const ingresosChartData: { month: string; ingresos: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const monthDate = subMonths(now, i);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const label = format(monthDate, "MMM yy");

    const monthReservas = pagadas.filter((r) => {
      const d = new Date(r.created_at);
      return d >= monthStart && d <= monthEnd;
    });

    reservasChartData.push({ month: label, reservas: monthReservas.length });
    ingresosChartData.push({
      month: label,
      ingresos: monthReservas.reduce((sum, r) => sum + Number(r.precio), 0),
    });
  }

  /* Revenue projection — linear regression + 3 months forward */
  const n = ingresosChartData.length;
  const sumX = ingresosChartData.reduce((s, _, i) => s + i, 0);
  const sumY = ingresosChartData.reduce((s, d) => s + d.ingresos, 0);
  const sumXY = ingresosChartData.reduce((s, d, i) => s + i * d.ingresos, 0);
  const sumX2 = ingresosChartData.reduce((s, _, i) => s + i * i, 0);
  const denom = n * sumX2 - sumX * sumX;
  const slope = denom !== 0 ? (n * sumXY - sumX * sumY) / denom : 0;
  const intercept = (sumY - slope * sumX) / n;

  const projectionData: { month: string; ingresos: number; tipo: "actual" | "proyectado" }[] = ingresosChartData.map((d) => ({
    month: d.month,
    ingresos: d.ingresos,
    tipo: "actual" as const,
  }));

  for (let i = 1; i <= 3; i++) {
    const futureMonth = format(addMonths(now, i), "MMM yy");
    const projected = Math.max(0, Math.round(intercept + slope * (n - 1 + i)));
    projectionData.push({
      month: futureMonth,
      ingresos: projected,
      tipo: "proyectado" as const,
    });
  }

  /* Top destinations by bookings */
  const destinoCounts: Record<string, number> = {};
  pagadas.forEach((r) => {
    const name = r.destino || "Otro";
    destinoCounts[name] = (destinoCounts[name] || 0) + 1;
  });
  const destinosChartData = Object.entries(destinoCounts)
    .map(([destino, value]) => ({ destino, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const greeting = t('greeting', { name: client.nombre });
  const dateStr = new Date().toLocaleDateString(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-2">
      {/* Greeting */}
      <PremiumGreeting
        greeting={greeting}
        clientName={client.nombre}
        dateStr={dateStr}
      />

      {/* 4 KPI Cards */}
      <StaggeredGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        <StaggeredItem>
          <KPICard
            title={t('totalBilled')}
            value={`${totalFacturado.toLocaleString(locale)} €`}
            numericValue={totalFacturado}
            locale={locale}
            valueSuffix="€"
            icon={<DollarSign className="w-5 h-5" />}
            accentColor="emerald"
            subtitle={t('paidBookingsSub')}
          />
        </StaggeredItem>
        <StaggeredItem>
          <KPICard
            title={t('paidBookings')}
            value={numeroReservas}
            numericValue={numeroReservas}
            locale={locale}
            icon={<ShoppingBag className="w-5 h-5" />}
            accentColor="turquoise"
            subtitle={t('thisPeriod')}
          />
        </StaggeredItem>
        <StaggeredItem>
          <KPICard
            title={t('avgTicket')}
            value={`${ticketMedio} €`}
            numericValue={ticketMedio}
            locale={locale}
            valueSuffix="€"
            icon={<Ticket className="w-5 h-5" />}
            accentColor="purple"
            subtitle={t('perBooking')}
          />
        </StaggeredItem>
        <StaggeredItem>
          <KPICard
            title={t('activeDestinations')}
            value={destinosActivos ?? 0}
            numericValue={destinosActivos ?? 0}
            locale={locale}
            icon={<Map className="w-5 h-5" />}
            accentColor="amber"
            subtitle={t('publishedOnWeb')}
          />
        </StaggeredItem>
      </StaggeredGrid>

      {/* Row 2: Chart | Events | Chart — 1+2+1 bento */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
        <ReservasChart data={reservasChartData} compact />
        <div className="lg:col-span-2">
          <UpcomingEventsWidget
            events={(upcomingEvents ?? []) as any[]}
            locale={locale}
            labels={{
              upcomingEvents: t('upcomingEvents'),
              viewCalendar: t('viewCalendar'),
              noUpcomingEvents: t('noUpcomingEvents'),
              today: tc('today'),
              tomorrow: tc('tomorrow'),
              allDay: t('allDay'),
            }}
          />
        </div>
        <RevenueProjectionChart data={projectionData} compact />
      </div>

      {/* Row 3: Wide chart | Wide bookings — 1+1 bento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <IngresosChart data={ingresosChartData} compact />
        <LatestBookings
          bookings={reservasSafe as any[]}
          locale={locale}
          labels={{
            latestBookings: t('latestBookings'),
            viewAll: tc('viewAll'),
            noBookingsYet: t('noBookingsYet'),
            booking: t('booking'),
            count: reservasSafe.length,
          }}
        />
      </div>

      {/* Row 4: Wide map | Destinos | Messages — 2+1+1 bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="sm:col-span-2 lg:col-span-2">
          <DestinationsMapWrapper
            destinations={(destinosConCoords ?? []) as any[]}
            labels={{
              destinationsMap: t('destinationsMap'),
              viewDestinations: t('viewDestinations'),
              noDestinations: t('noDestinations'),
            }}
          />
        </div>
        {destinosChartData.length > 0 && (
          <DestinosChart data={destinosChartData} compact />
        )}
        <div className={destinosChartData.length > 0 ? "" : "sm:col-span-2 lg:col-span-2"}>
          <RecentMessagesWidget
            messages={(recentMessages ?? []) as any[]}
            locale={locale}
            labels={{
              recentMessages: t('recentMessages'),
              viewAllMessages: t('viewAllMessages'),
              noMessages: t('noMessages'),
              unread: t('unread'),
            }}
          />
        </div>
      </div>
    </div>
  );
}
