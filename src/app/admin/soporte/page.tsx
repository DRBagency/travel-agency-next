import { supabaseAdmin } from "@/lib/supabase-server";
import { requireAdminClient } from "@/lib/requireAdminClient";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getTickets(clienteId: string) {
  const { data } = await supabaseAdmin
    .from("support_tickets")
    .select("*")
    .eq("cliente_id", clienteId)
    .order("created_at", { ascending: false });

  return data || [];
}

export default async function AdminSoportePage() {
  const client = await requireAdminClient();
  const tickets = await getTickets(client.id);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Soporte</h1>
          <p className="text-gray-500 dark:text-white/60">Gestiona tus tickets de soporte</p>
        </div>
        <Link
          href="/admin/soporte/nuevo"
          className="px-4 py-2 bg-drb-lime-500 hover:bg-drb-lime-400 text-drb-turquoise-900 font-bold rounded-xl transition-colors"
        >
          Nuevo Ticket
        </Link>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="panel-card p-6">
          <p className="text-gray-500 dark:text-white/60 text-sm mb-1">Tickets abiertos</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {tickets.filter((t) => t.status === "open").length}
          </p>
        </div>
        <div className="panel-card p-6">
          <p className="text-gray-500 dark:text-white/60 text-sm mb-1">En progreso</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {tickets.filter((t) => t.status === "in_progress").length}
          </p>
        </div>
        <div className="panel-card p-6">
          <p className="text-gray-500 dark:text-white/60 text-sm mb-1">Cerrados</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {tickets.filter((t) => t.status === "closed").length}
          </p>
        </div>
      </div>

      {/* Lista de tickets */}
      <div className="panel-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/10">
                <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-white/60">
                  ID
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-white/60">
                  Asunto
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-white/60">
                  Prioridad
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-white/60">
                  Estado
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-white/60">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-gray-400 dark:text-white/40"
                  >
                    No hay tickets creados
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="table-row"
                  >
                    <td className="p-4 text-gray-500 dark:text-white/60 text-sm font-mono">
                      <Link
                        href={`/admin/soporte/${ticket.id}`}
                        className="hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        #{ticket.id.substring(0, 8)}
                      </Link>
                    </td>
                    <td className="p-4 text-gray-900 dark:text-white">
                      <Link
                        href={`/admin/soporte/${ticket.id}`}
                        className="hover:underline"
                      >
                        {ticket.subject}
                      </Link>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          ticket.priority === "urgent"
                            ? "badge-danger"
                            : ticket.priority === "high"
                              ? "bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-300 border border-orange-200 dark:border-orange-500/30"
                              : "badge-info"
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          ticket.status === "open"
                            ? "badge-success"
                            : ticket.status === "in_progress"
                              ? "badge-warning"
                              : "bg-gray-100 dark:bg-white/15 text-gray-500 dark:text-white/60 border border-gray-200 dark:border-white/20"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 dark:text-white/60 text-sm">
                      {new Date(ticket.created_at).toLocaleDateString("es-ES")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
