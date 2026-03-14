export default function InsightsLoading() {
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />
        <div className="mt-3 h-4 w-72 animate-pulse rounded bg-slate-100" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="card p-6">
            <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
            <div className="mt-4 h-8 w-24 animate-pulse rounded bg-slate-100" />
            <div className="mt-3 h-3 w-40 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
