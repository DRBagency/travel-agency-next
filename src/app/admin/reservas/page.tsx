import { supabaseAdmin } from "@/lib/supabase-server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import SubmitButton from "@/components/admin/SubmitButton";
import ExportPDFButton from "@/components/admin/ExportPDFButton";
import KPICard from "@/components/ui/KPICard";
import { requireAdminClient } from "@/lib/requireAdminClient";
import { DollarSign, ShoppingBag, Ticket, Filter } from "lucide-react";

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
          Reservas
        </h1>
        <p className="text-gray-400 dark:text-white/40">{client.nombre} · {client.domain}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="Total facturado"
          value={`${totalFacturado.toLocaleString("es-ES")} €`}
          icon={<DollarSign className="w-5 h-5" />}
          variant="gradient"
        />
        <KPICard
          title="Reservas pagadas"
          value={numeroReservas}
          icon={<ShoppingBag className="w-5 h-5" />}
          iconBg="bg-drb-turquoise-50 dark:bg-drb-turquoise-500/15"
          iconColor="text-drb-turquoise-600 dark:text-drb-turquoise-400"
        />
        <KPICard
          title="Ticket medio"
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
            placeholder="Buscar nombre o email"
            className="panel-input text-sm"
          />
          <select
            name="estado"
            defaultValue={estado}
            className="panel-input text-sm"
          >
            <option value="todos">Todos</option>
            <option value="pagado">Pagado</option>
            <option value="pendiente">Pendiente</option>
            <option value="revisada">Revisada</option>
            <option value="cancelada">Cancelada</option>
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
            Filtrar
          </button>
          <div className="ml-auto flex gap-2">
            <ExportPDFButton estado={estado} q={q} from={from} to={to} />
            <a
              href={`/api/admin/export?estado=${estado}&q=${q}&from=${from}&to=${to}`}
              className="px-4 py-2 rounded-xl bg-drb-turquoise-50 dark:bg-drb-turquoise-500/15 text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:bg-drb-turquoise-100 dark:hover:bg-drb-turquoise-500/25 font-semibold text-sm transition-colors"
            >
              Exportar CSV
            </a>
          </div>
        </form>
      </div>

      {/* Table */}
      {reservasSafe.length === 0 ? (
        <div className="panel-card p-12 text-center">
          <p className="text-gray-400 dark:text-white/40">No hay reservas.</p>
        </div>
      ) : (
        <div className="panel-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/[0.06] bg-gray-50/80 dark:bg-white/[0.02]">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-white/40 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-white/40 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-white/40 uppercase tracking-wider">Destino</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-white/40 uppercase tracking-wider">Personas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-white/40 uppercase tracking-wider">Precio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-white/40 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody>
                {reservasSafe.map((r) => (
                  <tr key={r.id} className="table-row">
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-white/50">
                      {new Date(r.created_at).toLocaleDateString("es-ES")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-drb-turquoise-50 dark:bg-drb-turquoise-500/15 flex items-center justify-center text-drb-turquoise-600 dark:text-drb-turquoise-400 text-xs font-semibold shrink-0">
                          {(r.nombre || "?").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-sm text-gray-900 dark:text-white">{r.nombre}</div>
                          <div className="text-xs text-gray-400 dark:text-white/40">{r.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-drb-turquoise-600 dark:text-drb-turquoise-400">
                        {r.destino}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{r.personas}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{r.precio} €</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={
                            r.estado_pago === "pagado"
                              ? "badge-success"
                              : r.estado_pago === "pendiente"
                                ? "badge-warning"
                                : r.estado_pago === "revisada"
                                  ? "badge-info"
                                  : r.estado_pago === "cancelada"
                                    ? "badge-danger"
                                    : "badge-info"
                          }
                        >
                          {r.estado_pago}
                        </span>
                        <form action={updateEstado} className="flex gap-1.5">
                          <input type="hidden" name="id" value={r.id} />
                          <select
                            name="estado"
                            defaultValue={r.estado_pago}
                            className="panel-input text-xs py-1 px-2"
                          >
                            <option value="pagado">Pagado</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="revisada">Revisada</option>
                            <option value="cancelada">Cancelada</option>
                          </select>
                          <SubmitButton className="px-2 py-1 text-xs btn-primary rounded-lg">
                            OK
                          </SubmitButton>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
