import { supabaseAdmin } from "@/lib/supabase-server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import ExportPDFButton from "@/components/admin/ExportPDFButton";
import KPICard from "@/components/ui/KPICard";
import { requireAdminClient } from "@/lib/requireAdminClient";
import ReservasTable from "./ReservasTable";
import { DollarSign, ShoppingBag, Ticket, Filter } from "lucide-react";
import { getTranslations, getLocale } from 'next-intl/server';

async function updateEstado(formData: FormData) {
  "use server";

  const clienteId = (await cookies()).get("cliente_id")?.value;
  if (!clienteId) return;

  const id = formData.get("id") as string;
  const estado = formData.get("estado") as string;

  await supabaseAdmin
    .from("reservas")
    .update({ estado_pago: estado })
    .eq("id", id);

  revalidatePath("/admin");
  revalidatePath("/admin/reservas");
}

interface AdminPageProps {
  searchParams: Promise<{
    estado?: string;
    q?: string;
    from?: string;
    to?: string;
  }>;
}

export default async function AdminReservasPage({ searchParams }: AdminPageProps) {
  const {
    estado = "todos",
    q = "",
    from = "",
    to = "",
  } = await searchParams;

  const client = await requireAdminClient();
  const t = await getTranslations('admin.reservas');
  const tc = await getTranslations('common');
  const locale = await getLocale();

  let query = supabaseAdmin
    .from("reservas")
    .select("*")
    .eq("cliente_id", client.id)
    .order("created_at", { ascending: false });

  if (estado !== "todos") {
    query = query.eq("estado_pago", estado);
  }

  if (q) {
    query = query.or(`nombre.ilike.%${q}%,email.ilike.%${q}%`);
  }

  if (from) {
    query = query.gte("created_at", `${from}T00:00:00.000Z`);
  }

  if (to) {
    query = query.lte("created_at", `${to}T23:59:59.999Z`);
  }

  const { data: reservas, error } = await query;

  if (error) {
    return (
      <div className="p-8">
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  const reservasSafe = reservas ?? [];

  const pagadas = reservasSafe.filter((r) => r.estado_pago === "pagado");
  const totalFacturado = pagadas.reduce(
    (sum, r) => sum + Number(r.precio),
    0
  );
  const numeroReservas = pagadas.length;
  const ticketMedio =
    numeroReservas > 0
      ? Math.round(totalFacturado / numeroReservas)
      : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {t('title')}
        </h1>
        <p className="text-gray-400 dark:text-white/40">{client.nombre} · {client.domain}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title={t('totalBilled')}
          value={`${totalFacturado.toLocaleString(locale)} €`}
          icon={<DollarSign className="w-5 h-5" />}
          variant="gradient"
        />
        <KPICard
          title={t('paidBookings')}
          value={numeroReservas}
          icon={<ShoppingBag className="w-5 h-5" />}
          iconBg="bg-drb-turquoise-50 dark:bg-drb-turquoise-500/15"
          iconColor="text-drb-turquoise-600 dark:text-drb-turquoise-400"
        />
        <KPICard
          title={t('avgTicket')}
          value={`${ticketMedio} €`}
          icon={<Ticket className="w-5 h-5" />}
          iconBg="bg-purple-50 dark:bg-purple-500/15"
          iconColor="text-purple-600 dark:text-purple-400"
        />
      </div>

      {/* Filters */}
      <div className="panel-card p-4">
        <form method="get" className="flex flex-wrap items-center gap-3">
          <Filter className="w-4 h-4 text-gray-400 dark:text-white/30" />
          <input
            name="q"
            defaultValue={q}
            placeholder={t('searchPlaceholder')}
            className="panel-input text-sm"
          />
          <select
            name="estado"
            defaultValue={estado}
            className="panel-input text-sm"
          >
            <option value="todos">{tc('all')}</option>
            <option value="pagado">{t('paid')}</option>
            <option value="pendiente">{t('pending')}</option>
            <option value="revisada">{t('reviewed')}</option>
            <option value="cancelada">{t('cancelled')}</option>
          </select>
          <input
            type="date"
            name="from"
            defaultValue={from}
            className="panel-input text-sm"
          />
          <input
            type="date"
            name="to"
            defaultValue={to}
            className="panel-input text-sm"
          />
          <button className="btn-primary text-sm">
            {tc('filter')}
          </button>
          <div className="ml-auto flex gap-2">
            <ExportPDFButton estado={estado} q={q} from={from} to={to} />
            <a
              href={`/api/admin/export?estado=${estado}&q=${q}&from=${from}&to=${to}`}
              className="px-4 py-2 rounded-xl bg-drb-turquoise-50 dark:bg-drb-turquoise-500/15 text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:bg-drb-turquoise-100 dark:hover:bg-drb-turquoise-500/25 font-semibold text-sm transition-colors"
            >
              {tc('exportCSV')}
            </a>
          </div>
        </form>
      </div>

      {/* DataTable */}
      <div className="panel-card overflow-hidden">
        <ReservasTable
          data={reservasSafe as any[]}
          updateAction={updateEstado}
        />
      </div>
    </div>
  );
}
