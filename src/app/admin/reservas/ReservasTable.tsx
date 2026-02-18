"use client";

import { useTransition } from "react";
import DataTable, { Column } from "@/components/ui/DataTable";
import { useTranslations, useLocale } from "next-intl";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface Reserva {
  id: string;
  nombre: string;
  email: string;
  destino: string;
  personas: number;
  precio: number;
  estado_pago: string;
  created_at: string;
}

interface Props {
  data: Reserva[];
  updateAction: (formData: FormData) => Promise<void>;
}

function StatusCell({
  reserva,
  updateAction,
}: {
  reserva: Reserva;
  updateAction: (formData: FormData) => Promise<void>;
}) {
  const t = useTranslations("admin.reservas");
  const [isPending, startTransition] = useTransition();

  const badgeClass =
    reserva.estado_pago === "pagado"
      ? "badge-success"
      : reserva.estado_pago === "pendiente"
        ? "badge-warning"
        : reserva.estado_pago === "revisada"
          ? "badge-info"
          : reserva.estado_pago === "cancelada"
            ? "badge-danger"
            : "badge-info";

  const handleChange = (newEstado: string) => {
    if (newEstado === reserva.estado_pago) return;
    const fd = new FormData();
    fd.set("id", reserva.id);
    fd.set("estado", newEstado);
    startTransition(() => {
      updateAction(fd);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <span className={badgeClass}>{reserva.estado_pago}</span>
      <select
        defaultValue={reserva.estado_pago}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isPending}
        className="panel-input text-xs py-1 px-2"
      >
        <option value="pagado">{t("paid")}</option>
        <option value="pendiente">{t("pending")}</option>
        <option value="revisada">{t("reviewed")}</option>
        <option value="cancelada">{t("cancelled")}</option>
      </select>
      {isPending && <Loader2 className="w-3 h-3 animate-spin text-gray-400" />}
    </div>
  );
}

export default function ReservasTable({ data, updateAction }: Props) {
  const t = useTranslations("admin.reservas");
  const locale = useLocale();

  const columns: Column<Reserva>[] = [
    {
      key: "created_at",
      header: t("date"),
      sortable: true,
      sortValue: (row) => new Date(row.created_at).getTime(),
      render: (row) => (
        <span className="text-sm text-gray-500 dark:text-white/50">
          {new Date(row.created_at).toLocaleDateString(locale)}
        </span>
      ),
    },
    {
      key: "nombre",
      header: t("client"),
      sortable: true,
      render: (row) => (
        <Link
          href={`/admin/reserva/${row.id}`}
          className="flex items-center gap-3 group"
        >
          <div className="w-8 h-8 rounded-full bg-drb-turquoise-50 dark:bg-drb-turquoise-500/15 flex items-center justify-center text-drb-turquoise-600 dark:text-drb-turquoise-400 text-xs font-semibold shrink-0">
            {(row.nombre || "?").charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-sm text-gray-900 dark:text-white group-hover:text-drb-turquoise-600 dark:group-hover:text-drb-turquoise-400 transition-colors">
              {row.nombre}
            </div>
            <div className="text-xs text-gray-400 dark:text-white/40">
              {row.email}
            </div>
          </div>
        </Link>
      ),
    },
    {
      key: "destino",
      header: t("destination"),
      sortable: true,
      render: (row) => (
        <span className="text-sm font-medium text-drb-turquoise-600 dark:text-drb-turquoise-400">
          {row.destino}
        </span>
      ),
    },
    {
      key: "personas",
      header: t("people"),
      sortable: true,
      render: (row) => (
        <span className="text-sm text-gray-900 dark:text-white">
          {row.personas}
        </span>
      ),
    },
    {
      key: "precio",
      header: t("price"),
      sortable: true,
      sortValue: (row) => row.precio,
      render: (row) => (
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          {row.precio} €
        </span>
      ),
    },
    {
      key: "estado_pago",
      header: t("status"),
      render: (row) => (
        <StatusCell reserva={row} updateAction={updateAction} />
      ),
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      rowKey={(row) => row.id}
      searchable={false}
      pageSize={15}
      emptyMessage={t("noBookings")}
    />
  );
}
