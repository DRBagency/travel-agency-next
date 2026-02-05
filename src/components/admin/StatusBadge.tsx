interface StatusBadgeProps {
  status: string | null;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const base =
    "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";

  if (status === "pagado") {
    return (
      <span className={`${base} bg-green-100 text-green-700`}>
        Pagado
      </span>
    );
  }

  if (status === "cancelado") {
    return (
      <span className={`${base} bg-red-100 text-red-700`}>
        Cancelado
      </span>
    );
  }

  return (
    <span className={`${base} bg-gray-100 text-gray-700`}>
      {status || "—"}
    </span>
  );
}