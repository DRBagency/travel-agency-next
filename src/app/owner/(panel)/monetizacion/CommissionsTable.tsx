"use client";

import DataTable, { Column } from "@/components/ui/DataTable";
import { useTranslations } from "next-intl";
import { DollarSign } from "lucide-react";

interface ComisionCliente {
  clienteId: string;
  nombre: string;
  count: number;
  total: number;
}

interface CommissionsTableProps {
  data: ComisionCliente[];
}

export default function CommissionsTable({ data }: CommissionsTableProps) {
  const t = useTranslations("owner.monetizacion");

  const columns: Column<ComisionCliente>[] = [
    {
      key: "rank",
      header: "#",
      render: (_row, ) => {
        const idx = data.indexOf(_row);
        return (
          <span className="text-gray-400 dark:text-white/40 text-sm font-medium">
            {idx + 1}
          </span>
        );
      },
    },
    {
      key: "nombre",
      header: t("agency"),
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-drb-turquoise-50 dark:bg-drb-turquoise-500/15 flex items-center justify-center text-drb-turquoise-600 dark:text-drb-turquoise-400 text-xs font-semibold">
            {(row.nombre || "?").charAt(0).toUpperCase()}
          </div>
          <span className="font-medium text-gray-900 dark:text-white text-sm">{row.nombre}</span>
        </div>
      ),
    },
    {
      key: "count",
      header: t("bookings"),
      sortable: true,
      render: (row) => (
        <span className="text-gray-500 dark:text-white/60 text-sm">{row.count}</span>
      ),
    },
    {
      key: "total",
      header: t("commissions"),
      sortable: true,
      render: (row) => (
        <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
          {row.total.toFixed(2)} €
        </span>
      ),
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      rowKey={(row) => row.clienteId}
      searchable={false}
      pageSize={10}
      emptyIcon={<DollarSign className="w-10 h-10" />}
      emptyMessage={t("noCommissions")}
    />
  );
}
