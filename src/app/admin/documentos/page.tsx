import { supabaseAdmin } from "@/lib/supabase-server";
import { requireAdminClient } from "@/lib/requireAdminClient";
import Link from "next/link";
import { Receipt, FileText, FileCheck } from "lucide-react";
import { getTranslations, getLocale } from 'next-intl/server';

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
  const locale = await getLocale();

  const documentTypes = [
    { id: "presupuesto", name: t('presupuesto'), icon: Receipt, color: "bg-drb-turquoise-500" },
    { id: "contrato", name: t('contrato'), icon: FileText, color: "bg-emerald-500" },
    { id: "factura", name: t('factura'), icon: FileCheck, color: "bg-purple-500" },
  ];

  return (
      <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
          <p className="text-gray-500 dark:text-white/60">{t('subtitle')}</p>
        </div>
      </div>

      {/* Tipos de documentos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {documentTypes.map((type) => (
          <Link
            key={type.id}
            href={`/admin/documentos/nuevo?tipo=${type.id}`}
            className="panel-card p-6 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div
                className={`${type.color} w-12 h-12 rounded-lg flex items-center justify-center`}
              >
                <type.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('createType', { type: type.name })}
                </h3>
                <p className="text-sm text-gray-500 dark:text-white/60">{tc('newDocument')}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Lista de documentos */}
      <div className="panel-card overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-white/10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('recentDocuments')}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/10">
                <th className="text-start p-4 text-sm font-medium text-gray-500 dark:text-white/60">
                  {tc('type')}
                </th>
                <th className="text-start p-4 text-sm font-medium text-gray-500 dark:text-white/60">
                  {tc('title')}
                </th>
                <th className="text-start p-4 text-sm font-medium text-gray-500 dark:text-white/60">
                  {tc('status')}
                </th>
                <th className="text-start p-4 text-sm font-medium text-gray-500 dark:text-white/60">
                  {tc('date')}
                </th>
                <th className="text-start p-4 text-sm font-medium text-gray-500 dark:text-white/60">
                  {tc('actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {documents.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-gray-400 dark:text-white/40"
                  >
                    {t('noDocuments')}
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr
                    key={doc.id}
                    className="table-row"
                  >
                    <td className="p-4">
                      <span className="badge-info px-2 py-1 rounded text-xs">
                        {doc.document_type}
                      </span>
                    </td>
                    <td className="p-4 text-gray-900 dark:text-white">{doc.title}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          doc.status === "sent"
                            ? "badge-success"
                            : "badge-warning"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 dark:text-white/60 text-sm">
                      {new Date(doc.created_at).toLocaleDateString(locale)}
                    </td>
                    <td className="p-4">
                      <Link
                        href={`/admin/documentos/${doc.id}`}
                        className="text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:text-drb-turquoise-500 dark:hover:text-drb-turquoise-300 text-sm"
                      >
                        {tc('view')}
                      </Link>
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
