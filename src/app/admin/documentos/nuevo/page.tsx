import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-server";
import { requireAdminClient } from "@/lib/requireAdminClient";
import SubmitButton from "@/components/admin/SubmitButton";
import Link from "next/link";
import DocumentFormClient from "../DocumentFormClient";

export const dynamic = "force-dynamic";

const VALID_TYPES = ["presupuesto", "contrato", "factura"];

async function createDocument(formData: FormData) {
  "use server";

  const clientId = (await cookies()).get("cliente_id")?.value;
  if (!clientId) return;

  const title = formData.get("title") as string;
  const documentType = formData.get("document_type") as string;
  const clientName = formData.get("client_name") as string;
  const clientEmail = formData.get("client_email") as string;
  const validityDate = formData.get("validity_date") as string;
  const conditions = formData.get("conditions") as string;
  const notes = formData.get("notes") as string;

  if (!title?.trim() || !documentType) return;

  // Parse items from the hidden JSON input
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

  const { data: doc, error } = await supabaseAdmin
    .from("documents")
    .insert({
      cliente_id: clientId,
      document_type: documentType,
      title: title.trim(),
      content,
      status: "draft",
    })
    .select("id")
    .single();

  if (error || !doc) return;

  revalidatePath("/admin/documentos");
  redirect(`/admin/documentos/${doc.id}`);
}

export default async function NuevoDocumentoPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>;
}) {
  await requireAdminClient();
  const { tipo } = await searchParams;

  const documentType = VALID_TYPES.includes(tipo || "") ? tipo! : "presupuesto";

  const typeLabel =
    documentType === "presupuesto"
      ? "Presupuesto"
      : documentType === "contrato"
        ? "Contrato"
        : "Factura";

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/documentos"
          className="text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          &larr; Volver
        </Link>
        <div>
          <h1 className="text-3xl font-bold mb-1">Crear {typeLabel}</h1>
          <p className="text-gray-500 dark:text-white/60">Rellena los datos del documento</p>
        </div>
      </div>

      <div className="panel-card p-6">
        <form action={createDocument} className="grid gap-4">
          <input type="hidden" name="document_type" value={documentType} />
          <DocumentFormClient documentType={documentType}>
            <SubmitButton
              successText="Documento creado"
              className="btn-primary"
            >
              Guardar {typeLabel}
            </SubmitButton>
          </DocumentFormClient>
        </form>
      </div>
    </div>
  );
}
