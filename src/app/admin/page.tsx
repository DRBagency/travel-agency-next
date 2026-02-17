import { supabaseAdmin } from "@/lib/supabase-server";
import { requireAdminClient } from "@/lib/requireAdminClient";
import DashboardCard from "@/components/ui/DashboardCard";
import KPICard from "@/components/ui/KPICard";
import { ReservasChart, IngresosChart } from "@/components/admin/AdminAnalyticsCharts";
import { subMonths, format, startOfMonth, endOfMonth } from "date-fns";
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

  /* Métricas de reservas */
  const { data: reservas } = await supabaseAdmin
    .from("reservas")
    .select("precio, estado_pago, created_at, destino, nombre")
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

  const greeting = `Hola, ${client.nombre}!`;
  const dateStr = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{greeting}</h1>
        <p className="text-gray-400 dark:text-white/40 capitalize">{dateStr}</p>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total facturado"
          value={`${totalFacturado.toLocaleString("es-ES")} €`}
          icon={<DollarSign className="w-5 h-5" />}
          iconBg="bg-emerald-50 dark:bg-emerald-500/15"
          iconColor="text-emerald-600 dark:text-emerald-400"
          subtitle="Reservas pagadas"
        />
        <KPICard
          title="Reservas pagadas"
          value={numeroReservas}
          icon={<ShoppingBag className="w-5 h-5" />}
          iconBg="bg-drb-turquoise-50 dark:bg-drb-turquoise-500/15"
          iconColor="text-drb-turquoise-600 dark:text-drb-turquoise-400"
          subtitle="Este periodo"
        />
        <KPICard
          title="Ticket medio"
          value={`${ticketMedio} €`}
          icon={<Ticket className="w-5 h-5" />}
          iconBg="bg-purple-50 dark:bg-purple-500/15"
          iconColor="text-purple-600 dark:text-purple-400"
          subtitle="Por reserva"
        />
        <KPICard
          title="Destinos activos"
          value={destinosActivos ?? 0}
          icon={<Map className="w-5 h-5" />}
          iconBg="bg-amber-50 dark:bg-amber-500/15"
          iconColor="text-amber-600 dark:text-amber-400"
          subtitle="Publicados en web"
        />
      </div>

      {/* 2 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ReservasChart data={reservasChartData} />
        <IngresosChart data={ingresosChartData} />
      </div>

      {/* Navigation Cards */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Gestiona tu agencia</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <DashboardCard
            icon={<Globe className="w-5 h-5" />}
            title="Contenido Web"
            subtitle="Hero, stats, textos"
            href="/admin/mi-web"
          />
          <DashboardCard
            icon={<MapPin className="w-5 h-5" />}
            title="Destinos"
            subtitle="Crear y editar"
            href="/admin/destinos"
          />
          <DashboardCard
            icon={<CalendarCheck className="w-5 h-5" />}
            title="Reservas"
            subtitle="Ver y filtrar"
            href="/admin/reservas"
          />
          <DashboardCard
            icon={<Star className="w-5 h-5" />}
            title="Opiniones"
            subtitle="Moderar reviews"
            href="/admin/opiniones"
          />
          <DashboardCard
            icon={<Mail className="w-5 h-5" />}
            title="Emails"
            subtitle="Templates automáticos"
            href="/admin/emails"
          />
          <DashboardCard
            icon={<FileText className="w-5 h-5" />}
            title="Páginas Legales"
            subtitle="Privacidad, términos"
            href="/admin/legales"
          />
          <DashboardCard
            icon={<CreditCard className="w-5 h-5" />}
            title="Stripe / Pagos"
            subtitle="Suscripción y cobros"
            href="/admin/stripe"
          />
          <DashboardCard
            icon={<BarChart3 className="w-5 h-5" />}
            title="Estadísticas"
            subtitle="Métricas y gráficas"
            href="/admin/analytics"
          />
        </div>
      </div>

      {/* Últimas reservas */}
      <div className="panel-card">
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Últimas reservas</h2>
          <a
            href="/admin/reservas"
            className="btn-primary text-xs px-4 py-2"
          >
            Ver todas
          </a>
        </div>
        <div className="px-6 pb-6">
          {reservasSafe.length === 0 ? (
            <p className="text-gray-400 dark:text-white/40 py-4">No hay reservas todavía.</p>
          ) : (
            <div className="space-y-2">
              {reservasSafe.slice(0, 5).map((r: any) => (
                <div
                  key={r.id || r.created_at}
                  className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] px-4 py-3 hover:bg-drb-turquoise-50/50 dark:hover:bg-white/[0.05] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-drb-turquoise-50 dark:bg-drb-turquoise-500/15 flex items-center justify-center text-drb-turquoise-600 dark:text-drb-turquoise-400 text-sm font-semibold">
                      {(r.nombre || "R").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-gray-900 dark:text-white">{r.nombre || "Reserva"}</div>
                      <div className="text-xs text-gray-400 dark:text-white/40">
                        {r.destino || "—"} · {new Date(r.created_at).toLocaleDateString("es-ES")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{r.precio} €</span>
                    <span className={
                      r.estado_pago === "pagado"
                        ? "badge-success"
                        : r.estado_pago === "pendiente"
                          ? "badge-warning"
                          : "badge-info"
                    }>
                      {r.estado_pago}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
