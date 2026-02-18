"use client";

import DataTable, { Column } from "@/components/ui/DataTable";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";

interface Cliente {
  id: string;
  nombre: string | null;
  domain: string | null;
  plan: string | null;
  commission_rate: number | null;
  activo: boolean;
  stripe_account_id: string | null;
  stripe_charges_enabled: boolean;
}

interface ClientesTableProps {
  clientes: Cliente[];
}

export default function ClientesTable({ clientes }: ClientesTableProps) {
  const t = useTranslations("owner.clientes");
  const tc = useTranslations("common");
  const router = useRouter();

  const columns: Column<Cliente>[] = [
    {
      key: "nombre",
      header: tc("name"),
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-drb-turquoise-50 dark:bg-drb-turquoise-500/15 flex items-center justify-center text-drb-turquoise-600 dark:text-drb-turquoise-400 text-xs font-semibold shrink-0">
            {(row.nombre || "?").charAt(0).toUpperCase()}
          </div>
          <span className="font-medium text-gray-900 dark:text-white text-sm">
            {row.nombre || "—"}
          </span>
        </div>
      ),
    },
    {
      key: "domain",
      header: t("domain"),
      sortable: true,
      render: (row) => (
        <span className="text-gray-500 dark:text-white/50 text-sm">
          {row.domain || "—"}
        </span>
      ),
    },
    {
      key: "plan",
      header: tc("plan"),
      sortable: true,
      render: (row) => (
        <span className="badge-info">{row.plan || tc("noPlan")}</span>
      ),
    },
    {
      key: "commission_rate",
      header: t("commission"),
      sortable: true,
      sortValue: (row) => row.commission_rate ?? 0,
      render: (row) => (
        <span className="text-sm text-gray-700 dark:text-white/70">
          {typeof row.commission_rate === "number"
            ? `${Math.round(row.commission_rate * 100)} %`
            : "—"}
        </span>
      ),
    },
    {
      key: "stripe_status",
      header: t("stripeStatus"),
      render: (row) =>
        row.stripe_charges_enabled ? (
          <span className="badge-success">{t("stripeActive")}</span>
        ) : row.stripe_account_id ? (
          <span className="badge-warning">{t("stripePending")}</span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-white/70 px-3 py-1 text-xs font-semibold">
            {t("stripeNotConnected")}
          </span>
        ),
    },
    {
      key: "activo",
      header: tc("active"),
      sortable: true,
      sortValue: (row) => (row.activo ? 1 : 0),
      render: (row) =>
        row.activo ? (
          <span className="badge-success">{tc("yes")}</span>
        ) : (
          <span className="text-gray-400 dark:text-white/40 text-sm">{tc("no")}</span>
        ),
    },
  ];

  return (
    <DataTable
      data={clientes}
      columns={columns}
      rowKey={(row) => row.id}
      searchable
      searchKeys={["nombre", "domain"]}
      searchPlaceholder={tc("search")}
      pageSize={10}
      emptyIcon={<Building2 className="w-10 h-10" />}
      emptyMessage={t("noClients")}
      onRowClick={(row) => router.push(`/owner/clientes/${row.id}`)}
    />
  );
}
