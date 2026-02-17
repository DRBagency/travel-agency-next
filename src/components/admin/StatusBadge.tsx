interface StatusBadgeProps {
  status: string | null;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const base =
    "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";

  if (status === "pagado") {
    return (
      <span className={`${base} bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300`}>
        Pagado
      </span>
    );
  }

  if (status === "cancelado") {
    return (
      <span className={`${base} bg-red-50 text-red-700 dark:bg-red-500/20 dark:text-red-300`}>
        Cancelado
      </span>
    );
  }

  return (
    <span className={`${base} bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300`}>
      {status || "—"}
    </span>
  );
}
