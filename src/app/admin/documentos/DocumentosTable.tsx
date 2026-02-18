"use client";

import DataTable, { Column } from "@/components/ui/DataTable";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";

interface Document {
  id: string;
  document_type: string;
  title: string;
  status: string;
  created_at: string;
}

interface DocumentosTableProps {
  documents: Document[];
}

export default function DocumentosTable({ documents }: DocumentosTableProps) {
  const t = useTranslations("admin.documentos");
  const tc = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();

  const columns: Column<Document>[] = [
    {
      key: "document_type",
      header: tc("type"),
      sortable: true,
      render: (row) => (
        <span className="badge-info px-2 py-1 rounded text-xs">
          {row.document_type}
        </span>
      ),
    },
    {
      key: "title",
      header: tc("title"),
      sortable: true,
      render: (row) => (
        <span className="text-gray-900 dark:text-white text-sm font-medium">
          {row.title}
        </span>
      ),
    },
    {
      key: "status",
      header: tc("status"),
      sortable: true,
      render: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            row.status === "sent" ? "badge-success" : "badge-warning"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "created_at",
      header: tc("date"),
      sortable: true,
      sortValue: (row) => new Date(row.created_at).getTime(),
      render: (row) => (
        <span className="text-gray-500 dark:text-white/60 text-sm">
          {new Date(row.created_at).toLocaleDateString(locale)}
        </span>
      ),
    },
    {
      key: "actions",
      header: tc("actions"),
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/admin/documentos/${row.id}`);
          }}
          className="text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:text-drb-turquoise-500 dark:hover:text-drb-turquoise-300 text-sm font-medium"
        >
          {tc("view")}
        </button>
      ),
    },
  ];

  return (
    <DataTable
      data={documents}
      columns={columns}
      rowKey={(row) => row.id}
      searchable
      searchKeys={["title", "document_type"]}
      searchPlaceholder={tc("search")}
      pageSize={10}
      emptyIcon={<FileText className="w-10 h-10" />}
      emptyMessage={t("noDocuments")}
      onRowClick={(row) => router.push(`/admin/documentos/${row.id}`)}
    />
  );
}
