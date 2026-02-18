"use client";

import DataTable, { Column } from "@/components/ui/DataTable";
import { useTranslations, useLocale } from "next-intl";

interface Execution {
  id: string;
  status: string;
  error_message: string | null;
  executed_at: string;
  automations: { name: string } | null;
}

interface Props {
  data: Execution[];
}

export default function ExecutionLogsTable({ data }: Props) {
  const t = useTranslations("owner.automatizaciones");
  const tc = useTranslations("common");
  const locale = useLocale();

  const columns: Column<Execution>[] = [
    {
      key: "automation",
      header: t("automation"),
      sortable: true,
      sortValue: (row) =>
        (row.automations as unknown as { name: string })?.name || "",
      render: (row) => (
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {(row.automations as unknown as { name: string })?.name || "—"}
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
            row.status === "success"
              ? "badge-success"
              : row.status === "error"
                ? "badge-danger"
                : "badge-warning"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "error_message",
      header: tc("error"),
      render: (row) => (
        <span className="text-sm text-gray-400 dark:text-white/40 max-w-[200px] truncate block">
          {row.error_message || "—"}
        </span>
      ),
    },
    {
      key: "executed_at",
      header: tc("date"),
      sortable: true,
      sortValue: (row) => new Date(row.executed_at).getTime(),
      render: (row) => (
        <span className="text-sm text-gray-500 dark:text-white/60">
          {new Date(row.executed_at).toLocaleString(locale)}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      rowKey={(row) => row.id}
      searchable={false}
      pageSize={10}
      emptyMessage={t("noExecutions")}
    />
  );
}
