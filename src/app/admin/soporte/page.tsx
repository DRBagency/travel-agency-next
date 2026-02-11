import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getClientByDomain } from "@/lib/getClientByDomain";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getTickets(clienteId: string) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data } = await supabaseAdmin
    .from("support_tickets")
    .select("*")
    .eq("cliente_id", clienteId)
    .order("created_at", { ascending: false });

  return data || [];
}

export default async function AdminSoportePage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session");

  if (!sessionCookie) {
    redirect("/admin/login");
  }

  const cliente = await getClientByDomain();
  if (!cliente) {
    return <div>Cliente no encontrado</div>;
  }

  const tickets = await getTickets(cliente.id);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Soporte</h1>
          <p className="text-white/60">Gestiona tus tickets de soporte</p>
        </div>
        <Link
          href="/admin/soporte/nuevo"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Nuevo Ticket
        </Link>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
          <p className="text-white/60 text-sm mb-1">Tickets abiertos</p>
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
          <p className="text-white/60 text-sm mb-1">Cerrados</p>
          <p className="text-3xl font-bold text-white">
            {tickets.filter((t) => t.status === "closed").length}
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
                    colSpan={5}
                    className="p-8 text-center text-white/40"
                  >
                    No hay tickets creados
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="p-4 text-white/60 text-sm font-mono">
                      #{ticket.id.substring(0, 8)}
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
