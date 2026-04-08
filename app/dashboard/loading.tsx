export default function DashboardLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <div className="h-9 w-48 animate-pulse rounded-lg bg-stone-200" />
        <div className="mt-2 h-5 w-32 animate-pulse rounded-lg bg-stone-200" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200/60"
          >
            <div className="aspect-[3/2] animate-pulse bg-stone-200" />
            <div className="p-5">
              <div className="h-5 w-32 animate-pulse rounded bg-stone-200" />
              <div className="mt-2 h-4 w-24 animate-pulse rounded bg-stone-200" />
              <div className="mt-4 flex gap-2">
                <div className="h-6 w-20 animate-pulse rounded-full bg-stone-200" />
                <div className="h-6 w-16 animate-pulse rounded-full bg-stone-200" />
              </div>
              <div className="mt-4 h-16 w-full animate-pulse rounded-lg bg-stone-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
