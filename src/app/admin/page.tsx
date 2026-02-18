import { supabaseAdmin } from "@/lib/supabase-server";
import { requireAdminClient } from "@/lib/requireAdminClient";
import DashboardCard from "@/components/ui/DashboardCard";
import KPICard from "@/components/ui/KPICard";
import { ReservasChart, IngresosChart } from "@/components/admin/AdminAnalyticsCharts";
import {
  PremiumGreeting,
  StaggeredGrid,
  StaggeredItem,
  LatestBookings,
} from "@/components/admin/AdminDashboardClient";
import { subMonths, format, startOfMonth, endOfMonth } from "date-fns";
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

      {/* 2 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ReservasChart data={reservasChartData} />
        <IngresosChart data={ingresosChartData} />
      </div>

      {/* Navigation Cards */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('manageAgency')}</h2>
        <StaggeredGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <StaggeredItem>
            <DashboardCard
              icon={<Globe className="w-5 h-5" />}
              title={t('webContent')}
              subtitle={t('webContentSub')}
              href="/admin/mi-web"
            />
          </StaggeredItem>
          <StaggeredItem>
            <DashboardCard
              icon={<MapPin className="w-5 h-5" />}
              title={t('destinations')}
              subtitle={t('destinationsSub')}
              href="/admin/destinos"
            />
          </StaggeredItem>
          <StaggeredItem>
            <DashboardCard
              icon={<CalendarCheck className="w-5 h-5" />}
              title={t('bookings')}
              subtitle={t('bookingsSub')}
              href="/admin/reservas"
            />
          </StaggeredItem>
          <StaggeredItem>
            <DashboardCard
              icon={<Star className="w-5 h-5" />}
              title={t('reviews')}
              subtitle={t('reviewsSub')}
              href="/admin/opiniones"
            />
          </StaggeredItem>
          <StaggeredItem>
            <DashboardCard
              icon={<Mail className="w-5 h-5" />}
              title={tn('emails')}
              subtitle={t('emailsSub')}
              href="/admin/emails"
            />
          </StaggeredItem>
          <StaggeredItem>
            <DashboardCard
              icon={<FileText className="w-5 h-5" />}
              title={t('legalPages')}
              subtitle={t('legalPagesSub')}
              href="/admin/legales"
            />
          </StaggeredItem>
          <StaggeredItem>
            <DashboardCard
              icon={<CreditCard className="w-5 h-5" />}
              title={tn('stripe')}
              subtitle={t('stripeSub')}
              href="/admin/stripe"
            />
          </StaggeredItem>
          <StaggeredItem>
            <DashboardCard
              icon={<BarChart3 className="w-5 h-5" />}
              title={tn('analytics')}
              subtitle={t('statisticsSub')}
              href="/admin/analytics"
            />
          </StaggeredItem>
        </StaggeredGrid>
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
