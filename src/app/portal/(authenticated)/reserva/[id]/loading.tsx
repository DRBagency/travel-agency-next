export default function ReservaDetailLoading() {
  return (
    <div className="animate-pulse space-y-5">
      {/* Back link */}
      <div className="h-4 w-32 bg-gray-200 dark:bg-white/10 rounded" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gray-200 dark:bg-white/10 rounded-xl" />
          <div>
            <div className="h-6 w-40 bg-gray-200 dark:bg-white/10 rounded mb-1" />
            <div className="h-3 w-24 bg-gray-200 dark:bg-white/10 rounded" />
          </div>
        </div>
        <div className="h-7 w-20 bg-gray-200 dark:bg-white/10 rounded-full" />
      </div>

      {/* Timeline */}
      <div className="rounded-2xl border border-gray-200 dark:border-white/10 p-6">
        <div className="flex items-center justify-between gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-gray-200 dark:bg-white/10 rounded-full" />
                <div className="h-3 w-16 bg-gray-200 dark:bg-white/10 rounded mt-2" />
              </div>
              {i < 3 && <div className="flex-1 h-0.5 mx-3 bg-gray-200 dark:bg-white/10" />}
            </div>
          ))}
        </div>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-gray-200 dark:border-white/10 p-5">
              <div className="h-4 w-24 bg-gray-200 dark:bg-white/10 rounded mb-3" />
              <div className="space-y-2">
                <div className="h-3 w-full bg-gray-200 dark:bg-white/10 rounded" />
                <div className="h-3 w-3/4 bg-gray-200 dark:bg-white/10 rounded" />
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-200 dark:border-white/10 p-5">
            <div className="h-4 w-20 bg-gray-200 dark:bg-white/10 rounded mb-3" />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-3 w-20 bg-gray-200 dark:bg-white/10 rounded" />
                  <div className="h-3 w-16 bg-gray-200 dark:bg-white/10 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
