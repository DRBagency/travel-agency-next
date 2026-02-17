import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-server";
import { requireAdminClient } from "@/lib/requireAdminClient";
import SubmitButton from "@/components/admin/SubmitButton";
import Link from "next/link";
import DocumentFormClient from "../DocumentFormClient";

export const dynamic = "force-dynamic";

async function updateDocument(docId: string, formData: FormData) {
  "use server";

  const clientId = (await cookies()).get("cliente_id")?.value;
  if (!clientId) return;

  const title = formData.get("title") as string;
  const clientName = formData.get("client_name") as string;
  const clientEmail = formData.get("client_email") as string;
  const validityDate = formData.get("validity_date") as string;
  const conditions = formData.get("conditions") as string;
  const notes = formData.get("notes") as string;

  if (!title?.trim()) return;

  let items = [];
  try {
    const contentJson = JSON.parse(formData.get("content_json") as string);
    items = contentJson.items || [];
  } catch {
    items = [];
  }

  const content = {
    client_name: clientName || "",
    client_email: clientEmail || "",
    items,
    conditions: conditions || "",
    validity_date: validityDate || "",
    notes: notes || "",
  };

  await supabaseAdmin
    .from("documents")
    .update({ title: title.trim(), content })
    .eq("id", docId)
    .eq("cliente_id", clientId);

  revalidatePath(`/admin/documentos/${docId}`);
  revalidatePath("/admin/documentos");
}

async function deleteDocument(docId: string) {
  "use server";

  const clientId = (await cookies()).get("cliente_id")?.value;
  if (!clientId) return;

  await supabaseAdmin
    .from("documents")
    .delete()
    .eq("id", docId)
    .eq("cliente_id", clientId);

  revalidatePath("/admin/documentos");
  redirect("/admin/documentos");
}

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const client = await requireAdminClient();
  const { id } = await params;

  const { data: doc } = await supabaseAdmin
    .from("documents")
    .select("*")
    .eq("id", id)
    .eq("cliente_id", client.id)
    .single();

  if (!doc) notFound();

  const content = (doc.content || {}) as {
    client_name?: string;
    client_email?: string;
    items?: { description: string; quantity: number; unit_price: number; iva_percent: number }[];
    conditions?: string;
    validity_date?: string;
    notes?: string;
  };

  const typeLabel =
    doc.document_type === "presupuesto"
      ? "Presupuesto"
      : doc.document_type === "contrato"
        ? "Contrato"
        : "Factura";

  const updateBound = updateDocument.bind(null, id);
  const deleteBound = deleteDocument.bind(null, id);

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/documentos"
          className="text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          &larr; Volver
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">{doc.title}</h1>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="badge-info px-2 py-1 rounded text-xs">
              {typeLabel}
            </span>
            <span
              className={`px-2 py-1 rounded text-xs ${
                doc.status === "sent"
                  ? "badge-success"
                  : "badge-warning"
              }`}
            >
              {doc.status}
            </span>
            <span className="text-gray-400 dark:text-white/40 text-sm">
              {new Date(doc.created_at).toLocaleDateString("es-ES")}
            </span>
          </div>
        </div>

        <form action={deleteBound}>
          <button
            type="submit"
            className="badge-danger px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-600/30 transition-colors"
          >
            Eliminar documento
          </button>
        </form>
      </div>

      <div className="panel-card p-6">
        <form action={updateBound} className="grid gap-4">
          <DocumentFormClient
            documentType={doc.document_type}
            defaultValues={{
              title: doc.title,
              client_name: content.client_name || "",
              client_email: content.client_email || "",
              items: content.items || [],
              conditions: content.conditions || "",
              validity_date: content.validity_date || "",
              notes: content.notes || "",
            }}
          >
            <SubmitButton
              successText="Guardado"
              className="btn-primary"
            >
              Guardar cambios
            </SubmitButton>
          </DocumentFormClient>
        </form>
      </div>
    </div>
  );
}
