"use client";

import { useState, useMemo, ReactNode } from "react";
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, Download } from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  sortValue?: (row: T) => string | number;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchKeys?: string[];
  searchPlaceholder?: string;
  pageSize?: number;
  emptyIcon?: ReactNode;
  emptyMessage?: string;
  emptySubtext?: string;
  onExportCSV?: () => void;
  exportCSVLabel?: string;
  headerActions?: ReactNode;
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  stickyHeader?: boolean;
  filters?: ReactNode;
}

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchable = true,
  searchKeys = [],
  searchPlaceholder = "Search...",
  pageSize = 10,
  emptyIcon,
  emptyMessage = "No data found",
  emptySubtext,
  onExportCSV,
  exportCSVLabel = "Export CSV",
  headerActions,
  rowKey,
  onRowClick,
  stickyHeader = false,
  filters,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);

  // Search
  const filtered = useMemo(() => {
    if (!search.trim() || searchKeys.length === 0) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      searchKeys.some((key) => {
        const val = key.split(".").reduce((o: any, k) => o?.[k], row);
        return val != null && String(val).toLowerCase().includes(q);
      })
    );
  }, [data, search, searchKeys]);

  // Sort
  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const col = columns.find((c) => c.key === sortKey);
    if (!col) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = col.sortValue ? col.sortValue(a) : (a[sortKey] ?? "");
      const bVal = col.sortValue ? col.sortValue(b) : (b[sortKey] ?? "");
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      const comp = String(aVal).localeCompare(String(bVal));
      return sortDir === "asc" ? comp : -comp;
    });
  }, [filtered, sortKey, sortDir, columns]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const paged = sorted.slice(safePage * pageSize, (safePage + 1) * pageSize);

  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(0);
  }

  return (
    <div className="panel-card overflow-hidden">
      {/* Toolbar */}
      {(searchable || onExportCSV || headerActions || filters) && (
        <div className="p-4 border-b border-gray-100 dark:border-white/[0.06] flex flex-wrap items-center gap-3">
          {searchable && (
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/30" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                placeholder={searchPlaceholder}
                className="panel-input ps-9 w-full text-sm"
              />
            </div>
          )}
          {filters}
          <div className="ms-auto flex items-center gap-2">
            {onExportCSV && (
              <button
                onClick={onExportCSV}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-drb-turquoise-50 dark:bg-drb-turquoise-500/15 text-drb-turquoise-600 dark:text-drb-turquoise-400 hover:bg-drb-turquoise-100 dark:hover:bg-drb-turquoise-500/25 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                {exportCSVLabel}
              </button>
            )}
            {headerActions}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={stickyHeader ? "sticky top-0 z-10 bg-white dark:bg-gray-900" : ""}>
            <tr className="border-b border-gray-100 dark:border-white/[0.06] bg-gray-50/80 dark:bg-white/[0.02]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-3 text-start text-xs font-medium text-gray-400 dark:text-white/40 uppercase tracking-wider ${
                    col.sortable ? "cursor-pointer select-none hover:text-gray-600 dark:hover:text-white/60 transition-colors" : ""
                  } ${col.className || ""}`}
                  onClick={col.sortable ? () => toggleSort(col.key) : undefined}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && (
                      <span className="inline-flex flex-col">
                        {sortKey === col.key ? (
                          sortDir === "asc" ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )
                        ) : (
                          <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    {emptyIcon && (
                      <div className="text-gray-300 dark:text-white/20">{emptyIcon}</div>
                    )}
                    <p className="text-gray-400 dark:text-white/40 text-sm">{emptyMessage}</p>
                    {emptySubtext && (
                      <p className="text-gray-300 dark:text-white/20 text-xs">{emptySubtext}</p>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              paged.map((row) => (
                <tr
                  key={rowKey(row)}
                  className={`table-row ${onRowClick ? "cursor-pointer" : ""}`}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-6 py-4 ${col.className || ""}`}>
                      {col.render ? col.render(row) : (row[col.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {sorted.length > pageSize && (
        <div className="px-6 py-3 border-t border-gray-100 dark:border-white/[0.06] flex items-center justify-between text-sm">
          <span className="text-gray-400 dark:text-white/40 text-xs">
            {safePage * pageSize + 1}–{Math.min((safePage + 1) * pageSize, sorted.length)} / {sorted.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-500 dark:text-white/50 rtl:rotate-180" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i;
              } else if (safePage < 3) {
                pageNum = i;
              } else if (safePage > totalPages - 4) {
                pageNum = totalPages - 5 + i;
              } else {
                pageNum = safePage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                    safePage === pageNum
                      ? "bg-drb-turquoise-500 text-white"
                      : "text-gray-500 dark:text-white/50 hover:bg-gray-100 dark:hover:bg-white/[0.06]"
                  }`}
                >
                  {pageNum + 1}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={safePage >= totalPages - 1}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-500 dark:text-white/50 rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
