import { supabaseAdmin } from "@/lib/supabase-server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import SubmitButton from "@/components/admin/SubmitButton";
import ExportPDFButton from "@/components/admin/ExportPDFButton";
import { requireAdminClient } from "@/lib/requireAdminClient";

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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Reservas · {client.nombre}
          </h1>
          <p className="text-gray-500 dark:text-white/60">Dominio: {client.domain}</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="kpi-card">
            <p className="text-sm text-gray-500 dark:text-white/60">Total facturado</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalFacturado} €</p>
          </div>
          <div className="kpi-card">
            <p className="text-sm text-gray-500 dark:text-white/60">Reservas pagadas</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{numeroReservas}</p>
          </div>
          <div className="kpi-card">
            <p className="text-sm text-gray-500 dark:text-white/60">Ticket medio</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{ticketMedio} €</p>
          </div>
        </div>

        {/* Filters */}
        <form method="get" className="flex flex-wrap gap-3">
          <input
            name="q"
            defaultValue={q}
            placeholder="Buscar nombre o email"
            className="panel-input"
          />

          <select
            name="estado"
            defaultValue={estado}
            className="panel-input"
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
            className="panel-input"
          />

          <input
            type="date"
            name="to"
            defaultValue={to}
            className="panel-input"
          />

          <button
            className="px-4 py-2 bg-drb-turquoise-500 hover:bg-drb-turquoise-600 text-white rounded-xl font-bold transition-colors"
          >
            Filtrar
          </button>

          <div className="ml-auto flex gap-2">
            <ExportPDFButton estado={estado} q={q} from={from} to={to} />
            <a
              href={`/api/admin/export?estado=${estado}&q=${q}&from=${from}&to=${to}`}
              className="px-4 py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white rounded-xl font-semibold transition-colors"
            >
              Exportar CSV
            </a>
          </div>
        </form>

        {/* Table */}
        {reservasSafe.length === 0 ? (
          <p className="text-gray-500 dark:text-white/70">No hay reservas.</p>
        ) : (
          <div className="panel-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-white/5">
                  <tr>
                    <th className="p-3 text-left text-sm font-medium text-gray-500 dark:text-white/60">Fecha</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-500 dark:text-white/60">Cliente</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-500 dark:text-white/60">Destino</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-500 dark:text-white/60">Personas</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-500 dark:text-white/60">Precio</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-500 dark:text-white/60">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {reservasSafe.map((r) => (
                    <tr key={r.id} className="table-row">
                      <td className="p-3 text-gray-900 dark:text-white">
                        {new Date(r.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-gray-900 dark:text-white">{r.nombre}</div>
                        <div className="text-sm text-gray-500 dark:text-white/50">{r.email}</div>
                      </td>
                      <td className="p-3">
                        <a
                          href={`/admin/reserva/${r.id}`}
                          className="underline font-semibold text-drb-turquoise-600 dark:text-drb-lime-400 hover:text-drb-turquoise-700 dark:hover:text-drb-lime-300"
                        >
                          {r.destino}
                        </a>
                      </td>
                      <td className="p-3 text-gray-900 dark:text-white">{r.personas}</td>
                      <td className="p-3 text-gray-900 dark:text-white">{r.precio} €</td>
                      <td className="p-3">
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
                          <form action={updateEstado} className="flex gap-2">
                            <input type="hidden" name="id" value={r.id} />
                            <select
                              name="estado"
                              defaultValue={r.estado_pago}
                              className="panel-input text-sm py-1"
                            >
                              <option value="pagado">Pagado</option>
                              <option value="pendiente">Pendiente</option>
                              <option value="revisada">Revisada</option>
                              <option value="cancelada">Cancelada</option>
                            </select>
                            <SubmitButton
                              className="px-2 py-1 text-sm bg-drb-turquoise-500 hover:bg-drb-turquoise-600 text-white font-bold rounded-lg transition-colors"
                            >
                              Guardar
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
