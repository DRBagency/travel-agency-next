import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

async function getAllTickets() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data } = await supabaseAdmin
    .from("support_tickets")
    .select("*, clientes(nombre)")
    .order("created_at", { ascending: false });

  return data || [];
}

export default async function OwnerSoportePage() {
  const tickets = await getAllTickets();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Soporte</h1>
      <p className="text-white/60 mb-8">
        Gestiona todos los tickets de las agencias
      </p>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
          <p className="text-white/60 text-sm mb-1">Total tickets</p>
          <p className="text-3xl font-bold text-white">{tickets.length}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
          <p className="text-white/60 text-sm mb-1">Abiertos</p>
          <p className="text-3xl font-bold text-white">
            {tickets.filter((t) => t.status === "open").length}
          </p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
          <p className="text-white/60 text-sm mb-1">En progreso</p>
          <p className="text-3xl font-bold text-white">
            {tickets.filter((t) => t.status === "in_progress").length}
          </p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
          <p className="text-white/60 text-sm mb-1">Urgentes</p>
          <p className="text-3xl font-bold text-red-400">
            {tickets.filter((t) => t.priority === "urgent").length}
          </p>
        </div>
      </div>

      {/* Lista de tickets */}
      <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-sm font-medium text-white/60">
                  ID
                </th>
                <th className="text-left p-4 text-sm font-medium text-white/60">
                  Agencia
                </th>
                <th className="text-left p-4 text-sm font-medium text-white/60">
                  Asunto
                </th>
                <th className="text-left p-4 text-sm font-medium text-white/60">
                  Prioridad
                </th>
                <th className="text-left p-4 text-sm font-medium text-white/60">
                  Estado
                </th>
                <th className="text-left p-4 text-sm font-medium text-white/60">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-white/40"
                  >
                    No hay tickets
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => {
                  const cliente = ticket.clientes as unknown as { nombre: string } | null;
                  return (
                    <tr
                      key={ticket.id}
                      className="border-b border-white/5 hover:bg-white/5"
                    >
                      <td className="p-4 text-white/60 text-sm font-mono">
                        #{ticket.id.substring(0, 8)}
                      </td>
                      <td className="p-4 text-white">
                        {cliente?.nombre}
                      </td>
                      <td className="p-4 text-white">{ticket.subject}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            ticket.priority === "urgent"
                              ? "bg-red-500/20 text-red-300"
                              : ticket.priority === "high"
                                ? "bg-orange-500/20 text-orange-300"
                                : "bg-blue-500/20 text-blue-300"
                          }`}
                        >
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            ticket.status === "open"
                              ? "bg-green-500/20 text-green-300"
                              : ticket.status === "in_progress"
                                ? "bg-yellow-500/20 text-yellow-300"
                                : "bg-gray-500/20 text-gray-300"
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td className="p-4 text-white/60 text-sm">
                        {new Date(ticket.created_at).toLocaleDateString(
                          "es-ES"
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
