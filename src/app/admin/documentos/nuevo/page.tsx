import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-server";
import { requireAdminClient } from "@/lib/requireAdminClient";
import SubmitButton from "@/components/admin/SubmitButton";
import Link from "next/link";
import DocumentFormClient from "../DocumentFormClient";
import { getTranslations } from 'next-intl/server';

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
  const t = await getTranslations('admin.documentos');
  const tc = await getTranslations('common');
  await requireAdminClient();
  const { tipo } = await searchParams;

  const documentType = VALID_TYPES.includes(tipo || "") ? tipo! : "presupuesto";

  const typeLabel =
    documentType === "presupuesto"
      ? t('presupuesto')
      : documentType === "contrato"
        ? t('contrato')
        : t('factura');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/documentos"
          className="text-gray-400 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          &larr; {tc('back')}
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{t('createType', { type: typeLabel })}</h1>
          <p className="text-gray-400 dark:text-white/40">{t('fillData')}</p>
        </div>
      </div>

      <div className="panel-card p-6">
        <form action={createDocument} className="grid gap-4">
          <input type="hidden" name="document_type" value={documentType} />
          <DocumentFormClient documentType={documentType}>
            <SubmitButton
              successText={t('docCreated')}
              className="btn-primary"
            >
              {t('saveType', { type: typeLabel })}
            </SubmitButton>
          </DocumentFormClient>
        </form>
      </div>
    </div>
  );
}
