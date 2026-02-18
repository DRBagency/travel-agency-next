"use client";

import DataTable, { Column } from "@/components/ui/DataTable";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

interface Cliente {
  id: string;
  nombre: string;
  domain: string | null;
  plan: string | null;
  created_at: string;
  activo: boolean;
  stripe_subscription_id: string | null;
}

export default function LatestAgenciesTable({
  data,
}: {
  data: Cliente[];
}) {
  const t = useTranslations("owner.dashboard");
  const tc = useTranslations("common");
  const locale = useLocale();

  const columns: Column<Cliente>[] = [
    {
      key: "nombre",
      header: t("nameCol"),
      sortable: true,
      render: (row) => (
        <Link
          href={`/owner/clientes/${row.id}`}
          className="flex items-center gap-3 group"
        >
          <div className="w-8 h-8 rounded-full bg-drb-turquoise-50 dark:bg-drb-turquoise-500/15 flex items-center justify-center text-drb-turquoise-600 dark:text-drb-turquoise-400 text-xs font-semibold">
            {(row.nombre || "?").charAt(0).toUpperCase()}
          </div>
          <span className="font-medium text-gray-900 dark:text-white text-sm group-hover:text-drb-turquoise-600 dark:group-hover:text-drb-turquoise-400 transition-colors">
            {row.nombre}
          </span>
        </Link>
      ),
    },
    {
      key: "domain",
      header: t("domainCol"),
      sortable: true,
      render: (row) => (
        <span className="text-gray-500 dark:text-white/50 text-sm">
          {row.domain || "—"}
        </span>
      ),
    },
    {
      key: "plan",
      header: t("planCol"),
      sortable: true,
      render: (row) => (
        <span className="badge-info">{row.plan || tc("noPlan")}</span>
      ),
    },
    {
      key: "status",
      header: t("statusCol"),
      render: (row) =>
        row.stripe_subscription_id ? (
          <span className="badge-success">{t("activeStatus")}</span>
        ) : (
          <span className="badge-warning">{t("pendingStatus")}</span>
        ),
    },
    {
      key: "created_at",
      header: t("registeredCol"),
      sortable: true,
      sortValue: (row) => new Date(row.created_at).getTime(),
      render: (row) => (
        <span className="text-gray-400 dark:text-white/40 text-sm">
          {new Date(row.created_at).toLocaleDateString(locale)}
        </span>
      ),
    },
  ];

  return (
    <div className="panel-card">
      <div className="p-6 pb-0 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("latestAgencies")}
        </h2>
        <Link href="/owner/clientes" className="btn-primary text-xs px-4 py-2">
          {tc("viewAll")}
        </Link>
      </div>
      <DataTable
        data={data}
        columns={columns}
        rowKey={(row) => row.id}
        searchable={false}
        pageSize={10}
        emptyMessage={t("noClients")}
      />
    </div>
  );
}
