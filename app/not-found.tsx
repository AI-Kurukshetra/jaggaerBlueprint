import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-6 py-16">
      <div className="card p-10 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Page not found</h1>
        <p className="mt-2 text-sm text-slate-500">
          We couldn&apos;t find the page you&apos;re looking for.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-soft"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
