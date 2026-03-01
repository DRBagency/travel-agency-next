export default function PortalLoading() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Header skeleton */}
      <div>
        <div className="h-8 w-48 bg-gray-200 dark:bg-white/10 rounded-lg mb-2" />
        <div className="h-4 w-32 bg-gray-200 dark:bg-white/10 rounded" />
      </div>

      {/* Cards grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10">
            <div className="h-40 bg-gray-200 dark:bg-white/10" />
            <div className="p-4 space-y-3">
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-white/10 rounded" />
              <div className="h-3 w-1/2 bg-gray-200 dark:bg-white/10 rounded" />
              <div className="flex justify-between items-center">
                <div className="h-6 w-20 bg-gray-200 dark:bg-white/10 rounded" />
                <div className="h-6 w-16 bg-gray-200 dark:bg-white/10 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
