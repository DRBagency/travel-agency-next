import { supabaseAdmin } from "@/lib/supabase-server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import SaveToast from "@/components/admin/SaveToast";
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
  redirect("/admin/reservas?saved=guardado");
}

interface AdminPageProps {
  searchParams: Promise<{
    estado?: string;
    q?: string;
    from?: string;
    to?: string;
    saved?: string;
  }>;
}

export default async function AdminReservasPage({ searchParams }: AdminPageProps) {
  const {
    estado = "todos",
    q = "",
    from = "",
    to = "",
    saved,
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
    <AdminShell
      clientName={client.nombre}
      primaryColor={client.primary_color}
      logoUrl={client.logo_url}
      subscriptionActive={Boolean(client.stripe_subscription_id)}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">
              Reservas · {client.nombre}
            </h1>
            <p className="text-white/60">Dominio: {client.domain}</p>
          </div>
          <SaveToast message={saved === "guardado" ? "Estado actualizado" : null} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-white/20 rounded-2xl bg-white/10">
            <p className="text-sm text-white/60">Total facturado</p>
            <p className="text-2xl font-bold">{totalFacturado} €</p>
          </div>
          <div className="p-4 border border-white/20 rounded-2xl bg-white/10">
            <p className="text-sm text-white/60">Reservas pagadas</p>
            <p className="text-2xl font-bold">{numeroReservas}</p>
          </div>
          <div className="p-4 border border-white/20 rounded-2xl bg-white/10">
            <p className="text-sm text-white/60">Ticket medio</p>
            <p className="text-2xl font-bold">{ticketMedio} €</p>
          </div>
        </div>

        <form method="get" className="flex flex-wrap gap-3">
          <input
            name="q"
            defaultValue={q}
            placeholder="Buscar nombre o email"
            className="border border-white/30 bg-white/95 text-gray-900 placeholder:text-gray-400 px-3 py-2 rounded-xl"
          />

          <select
            name="estado"
            defaultValue={estado}
            className="border border-white/30 px-3 py-2 rounded-xl bg-white/95 text-gray-900"
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
            className="border border-white/30 px-3 py-2 rounded-xl bg-white/95 text-gray-900"
          />

          <input
            type="date"
            name="to"
            defaultValue={to}
            className="border border-white/30 px-3 py-2 rounded-xl bg-white/95 text-gray-900"
          />

          <button
            className="px-4 py-2 bg-drb-lime-500 hover:bg-drb-lime-400 text-drb-turquoise-900 rounded-xl font-bold transition-colors"
          >
            Filtrar
          </button>

          <a
            href={`/api/admin/export?estado=${estado}&q=${q}&from=${from}&to=${to}`}
            className="ml-auto px-4 py-2 bg-white hover:bg-white/90 text-drb-turquoise-800 rounded-xl font-semibold transition-colors"
          >
            Exportar CSV
          </a>
        </form>

        {reservasSafe.length === 0 ? (
          <p className="text-white/70">No hay reservas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-white/20 rounded-2xl overflow-hidden">
              <thead className="bg-white/10">
                <tr>
                  <th className="p-3 text-left">Fecha</th>
                  <th className="p-3 text-left">Cliente</th>
                  <th className="p-3 text-left">Destino</th>
                  <th className="p-3 text-left">Personas</th>
                  <th className="p-3 text-left">Precio</th>
                  <th className="p-3 text-left">Estado</th>
                </tr>
              </thead>
              <tbody>
                {reservasSafe.map((r) => (
                  <tr key={r.id} className="border-t border-white/10">
                    <td className="p-3">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <div className="font-semibold">{r.nombre}</div>
                      <div className="text-sm text-white/50">{r.email}</div>
                    </td>
                    <td className="p-3">
                      <a
                        href={`/admin/reserva/${r.id}`}
                        className="underline font-semibold text-drb-lime-400 hover:text-drb-lime-300"
                      >
                        {r.destino}
                      </a>
                    </td>
                    <td className="p-3">{r.personas}</td>
                    <td className="p-3">{r.precio} €</td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                            r.estado_pago === "pagado"
                              ? "bg-drb-lime-500/20 text-drb-lime-400 border-drb-lime-500/30"
                              : r.estado_pago === "pendiente"
                                ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                                : r.estado_pago === "revisada"
                                  ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                                  : r.estado_pago === "cancelada"
                                    ? "bg-red-500/20 text-red-300 border-red-500/30"
                                    : "bg-white/15 text-white/60 border-white/20"
                          }`}
                        >
                          {r.estado_pago}
                        </span>
                        <form action={updateEstado} className="flex gap-2">
                          <input type="hidden" name="id" value={r.id} />
                          <select
                            name="estado"
                            defaultValue={r.estado_pago}
                            className="border rounded-xl px-2 py-1 bg-white/95 text-gray-900 border-white/30"
                          >
                            <option value="pagado">Pagado</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="revisada">Revisada</option>
                            <option value="cancelada">Cancelada</option>
                          </select>
                          <button
                            type="submit"
                            className="px-2 py-1 text-sm bg-drb-lime-500 hover:bg-drb-lime-400 text-drb-turquoise-900 font-bold rounded-lg transition-colors"
                          >
                            Guardar
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
