export default function CRMLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 w-48 bg-gray-200 dark:bg-white/[0.06] rounded-lg" />
          <div className="h-4 w-72 bg-gray-100 dark:bg-white/[0.04] rounded-lg mt-2" />
        </div>
        <div className="h-9 w-32 bg-gray-200 dark:bg-white/[0.06] rounded-xl" />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="panel-card p-4">
            <div className="h-4 w-24 bg-gray-100 dark:bg-white/[0.04] rounded mb-2" />
            <div className="h-8 w-16 bg-gray-200 dark:bg-white/[0.06] rounded-lg" />
          </div>
        ))}
      </div>

      {/* Kanban skeleton */}
      <div>
        <div className="h-4 w-20 bg-gray-200 dark:bg-white/[0.06] rounded mb-3" />
        <div className="flex gap-3 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="min-w-[260px] w-[260px] rounded-xl border border-gray-200 dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.02]"
            >
              <div className="px-3 py-2.5 border-b border-gray-100 dark:border-white/[0.06]">
                <div className="h-4 w-20 bg-gray-200 dark:bg-white/[0.06] rounded" />
              </div>
              <div className="p-2 space-y-2 min-h-[120px]">
                <div className="h-16 bg-gray-100 dark:bg-white/[0.04] rounded-lg" />
                <div className="h-16 bg-gray-100 dark:bg-white/[0.04] rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent activities skeleton */}
      <div className="panel-card p-4">
        <div className="h-4 w-32 bg-gray-200 dark:bg-white/[0.06] rounded mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-white/[0.06]" />
              <div className="flex-1">
                <div className="h-3 w-40 bg-gray-100 dark:bg-white/[0.04] rounded mb-1" />
                <div className="h-4 w-64 bg-gray-200 dark:bg-white/[0.06] rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
