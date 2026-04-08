import Link from "next/link";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="text-6xl">🗺️</span>
      <h2 className="mt-6 text-2xl font-bold text-slate-900">
        Your bucket list is empty
      </h2>
      <p className="mt-2 max-w-md text-muted">
        Start by searching for countries you&apos;d love to visit. Save your
        favorites and keep track of your travel dreams!
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:from-teal-600 hover:to-teal-700 active:scale-[0.98]"
      >
        Explore Countries
      </Link>
    </div>
  );
}
