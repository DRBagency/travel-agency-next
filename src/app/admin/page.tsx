import { supabaseAdmin } from "@/lib/supabase-server";
import { requireAdminClient } from "@/lib/requireAdminClient";
import DashboardCard from "@/components/ui/DashboardCard";
import KPICard from "@/components/ui/KPICard";
import { ReservasChart, IngresosChart, RevenueProjectionChart, DestinosChart } from "@/components/admin/AdminAnalyticsCharts";
import {
  PremiumGreeting,
  StaggeredGrid,
  StaggeredItem,
  LatestBookings,
} from "@/components/admin/AdminDashboardClient";
import { subMonths, addMonths, format, startOfMonth, endOfMonth } from "date-fns";
import { getTranslations, getLocale } from 'next-intl/server';
import {
  Globe,
  MapPin,
  CalendarCheck,
  Star,
  Mail,
  FileText,
  CreditCard,
  BarChart3,
  DollarSign,
  ShoppingBag,
  Ticket,
  Map,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const client = await requireAdminClient();
  const t = await getTranslations('admin.dashboard');
  const tc = await getTranslations('common');
  const tn = await getTranslations('admin.nav');
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
    <div className="space-y-8">
      {/* Greeting */}
      <PremiumGreeting
        greeting={greeting}
        clientName={client.nombre}
        dateStr={dateStr}
      />

      {/* 4 KPI Cards */}
      <StaggeredGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* 3 Charts — same row like /owner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ReservasChart data={reservasChartData} />
        <IngresosChart data={ingresosChartData} />
        <RevenueProjectionChart data={projectionData} />
      </div>

      {/* Destinos Chart */}
      {destinosChartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <DestinosChart data={destinosChartData} />
        </div>
      )}

      {/* Navigation Cards */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('manageAgency')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <DashboardCard
            icon={<Globe className="w-5 h-5" />}
            title={t('webContent')}
            subtitle={t('webContentSub')}
            href="/admin/mi-web"
          />
          <DashboardCard
            icon={<MapPin className="w-5 h-5" />}
            title={t('destinations')}
            subtitle={t('destinationsSub')}
            href="/admin/destinos"
          />
          <DashboardCard
            icon={<CalendarCheck className="w-5 h-5" />}
            title={t('bookings')}
            subtitle={t('bookingsSub')}
            href="/admin/reservas"
          />
          <DashboardCard
            icon={<Star className="w-5 h-5" />}
            title={t('reviews')}
            subtitle={t('reviewsSub')}
            href="/admin/opiniones"
          />
          <DashboardCard
            icon={<Mail className="w-5 h-5" />}
            title={tn('emails')}
            subtitle={t('emailsSub')}
            href="/admin/emails"
          />
          <DashboardCard
            icon={<FileText className="w-5 h-5" />}
            title={t('legalPages')}
            subtitle={t('legalPagesSub')}
            href="/admin/legales"
          />
          <DashboardCard
            icon={<CreditCard className="w-5 h-5" />}
            title={tn('stripe')}
            subtitle={t('stripeSub')}
            href="/admin/stripe"
          />
          <DashboardCard
            icon={<BarChart3 className="w-5 h-5" />}
            title={tn('analytics')}
            subtitle={t('statisticsSub')}
            href="/admin/analytics"
          />
          <DashboardCard
            icon={<Sparkles className="w-5 h-5" />}
            title={t('aiTools')}
            subtitle={t('aiToolsSub')}
            href="/admin/ai/itinerarios"
          />
        </div>
      </div>

      {/* Últimas reservas */}
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
  );
}
