import { supabaseAdmin } from "@/lib/supabase-server";
import { requireAdminClient } from "@/lib/requireAdminClient";
import Link from "next/link";
import { Receipt, FileText, FileCheck } from "lucide-react";
import { getTranslations } from 'next-intl/server';
import DocumentosTable from "./DocumentosTable";

export const dynamic = "force-dynamic";

async function getDocuments(clienteId: string) {
  const { data } = await supabaseAdmin
    .from("documents")
    .select("*")
    .eq("cliente_id", clienteId)
    .order("created_at", { ascending: false });

  return data || [];
}

export default async function AdminDocumentosPage() {
  const client = await requireAdminClient();
  const documents = await getDocuments(client.id);
  const t = await getTranslations('admin.documentos');
  const tc = await getTranslations('common');

  const documentTypes = [
    { id: "presupuesto", name: t('presupuesto'), icon: Receipt, color: "bg-drb-turquoise-500" },
    { id: "contrato", name: t('contrato'), icon: FileText, color: "bg-emerald-500" },
    { id: "factura", name: t('factura'), icon: FileCheck, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{t('title')}</h1>
        <p className="text-gray-400 dark:text-white/40">{t('subtitle')}</p>
      </div>

      {/* Document type cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {documentTypes.map((type) => (
          <Link
            key={type.id}
            href={`/admin/documentos/nuevo?tipo=${type.id}`}
            className="panel-card p-5 hover:border-drb-turquoise-400/50 dark:hover:border-drb-turquoise-500/40 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div
                className={`${type.color} w-11 h-11 rounded-xl flex items-center justify-center shadow-md`}
              >
                <type.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {t('createType', { type: type.name })}
                </h3>
                <p className="text-xs text-gray-400 dark:text-white/40">{tc('newDocument')}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Documents table */}
      <DocumentosTable documents={documents} />
    </div>
  );
}
