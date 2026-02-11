import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getClientByDomain } from "@/lib/getClientByDomain";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getDocuments(clienteId: string) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data } = await supabaseAdmin
    .from("documents")
    .select("*")
    .eq("cliente_id", clienteId)
    .order("created_at", { ascending: false });

  return data || [];
}

export default async function AdminDocumentosPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session");

  if (!sessionCookie) {
    redirect("/admin/login");
  }

  const cliente = await getClientByDomain();
  if (!cliente) {
    return <div>Cliente no encontrado</div>;
  }

  const documents = await getDocuments(cliente.id);

  const documentTypes = [
    { id: "presupuesto", name: "Presupuesto", icon: "💰", color: "bg-blue-500" },
    { id: "contrato", name: "Contrato", icon: "📄", color: "bg-green-500" },
    { id: "factura", name: "Factura", icon: "🧾", color: "bg-purple-500" },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Documentos</h1>
          <p className="text-white/60">Crea y gestiona tus documentos</p>
        </div>
      </div>

      {/* Tipos de documentos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {documentTypes.map((type) => (
          <Link
            key={type.id}
            href={`/admin/documentos/nuevo?tipo=${type.id}`}
            className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div
                className={`${type.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}
              >
                {type.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Crear {type.name}
                </h3>
                <p className="text-sm text-white/60">Nuevo documento</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Lista de documentos */}
      <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">
            Documentos recientes
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-sm font-medium text-white/60">
                  Tipo
                </th>
                <th className="text-left p-4 text-sm font-medium text-white/60">
                  Título
                </th>
                <th className="text-left p-4 text-sm font-medium text-white/60">
                  Estado
                </th>
                <th className="text-left p-4 text-sm font-medium text-white/60">
                  Fecha
                </th>
                <th className="text-left p-4 text-sm font-medium text-white/60">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {documents.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-white/40"
                  >
                    No hay documentos creados
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr
                    key={doc.id}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="p-4">
                      <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-300">
                        {doc.document_type}
                      </span>
                    </td>
                    <td className="p-4 text-white">{doc.title}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          doc.status === "sent"
                            ? "bg-green-500/20 text-green-300"
                            : "bg-yellow-500/20 text-yellow-300"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td className="p-4 text-white/60 text-sm">
                      {new Date(doc.created_at).toLocaleDateString("es-ES")}
                    </td>
                    <td className="p-4">
                      <button className="text-blue-400 hover:text-blue-300 text-sm">
                        Ver
                      </button>
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
