"use client";

import DataTable, { Column } from "@/components/ui/DataTable";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Headphones } from "lucide-react";

interface Ticket {
  id: string;
  subject: string;
  priority: string;
  status: string;
  created_at: string;
  clientes: { nombre: string } | null;
}

interface SoporteTableProps {
  tickets: Ticket[];
}

export default function SoporteTable({ tickets }: SoporteTableProps) {
  const t = useTranslations("owner.soporte");
  const tc = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();

  const columns: Column<Ticket>[] = [
    {
      key: "id",
      header: "ID",
      render: (row) => (
        <span className="text-gray-500 dark:text-white/60 text-sm font-mono">
          #{row.id.substring(0, 8)}
        </span>
      ),
    },
    {
      key: "agency",
      header: t("agency"),
      sortable: true,
      sortValue: (row) => (row.clientes as any)?.nombre || "",
      render: (row) => (
        <span className="text-gray-900 dark:text-white text-sm">
          {(row.clientes as any)?.nombre || "—"}
        </span>
      ),
    },
    {
      key: "subject",
      header: t("subject"),
      sortable: true,
      render: (row) => (
        <span className="text-gray-900 dark:text-white text-sm">{row.subject}</span>
      ),
    },
    {
      key: "priority",
      header: t("priority"),
      sortable: true,
      render: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            row.priority === "urgent"
              ? "badge-danger"
              : row.priority === "high"
                ? "badge-warning"
                : "badge-info"
          }`}
        >
          {row.priority}
        </span>
      ),
    },
    {
      key: "status",
      header: t("status"),
      sortable: true,
      render: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            row.status === "open"
              ? "badge-success"
              : row.status === "in_progress"
                ? "badge-warning"
                : "bg-gray-100 text-gray-600 dark:bg-white/[0.06] dark:text-white/60"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "created_at",
      header: t("date"),
      sortable: true,
      sortValue: (row) => new Date(row.created_at).getTime(),
      render: (row) => (
        <span className="text-gray-500 dark:text-white/60 text-sm">
          {new Date(row.created_at).toLocaleDateString(locale)}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      data={tickets}
      columns={columns}
      rowKey={(row) => row.id}
      searchable
      searchKeys={["subject", "clientes.nombre"]}
      searchPlaceholder={tc("search")}
      pageSize={10}
      emptyIcon={<Headphones className="w-10 h-10" />}
      emptyMessage={t("noTickets")}
      onRowClick={(row) => router.push(`/owner/soporte/${row.id}`)}
    />
  );
}
