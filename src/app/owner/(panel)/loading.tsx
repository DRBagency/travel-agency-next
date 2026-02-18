export default function OwnerLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div>
        <div className="h-7 w-48 bg-gray-200 dark:bg-white/10 rounded-lg" />
        <div className="h-4 w-64 bg-gray-100 dark:bg-white/[0.06] rounded-lg mt-2" />
      </div>

      {/* KPI cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="panel-card p-5">
            <div className="h-4 w-24 bg-gray-100 dark:bg-white/[0.06] rounded mb-3" />
            <div className="h-8 w-20 bg-gray-200 dark:bg-white/10 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="panel-card p-6">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/[0.06]" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-gray-100 dark:bg-white/[0.06] rounded" />
                <div className="h-3 w-1/2 bg-gray-50 dark:bg-white/[0.03] rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
