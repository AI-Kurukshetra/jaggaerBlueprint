export default function SupplierLoading() {
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />
        <div className="mt-3 h-4 w-64 animate-pulse rounded bg-slate-100" />
      </div>
      <div className="card p-6">
        <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-10 animate-pulse rounded bg-slate-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
