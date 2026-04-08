import { getBucketList } from "@/app/actions/bucket-list";
import { BucketListCard } from "@/app/components/bucket-list-card";
import { EmptyState } from "@/app/components/empty-state";

export default async function DashboardPage() {
  const items = await getBucketList();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            My Bucket List
          </h1>
          <p className="mt-1 text-muted">
            {items.length === 0
              ? "No countries saved yet"
              : `${items.length} ${items.length === 1 ? "country" : "countries"} saved`}
          </p>
        </div>
        {items.length > 0 && (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-lg font-bold text-teal-700">
            {items.length}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <BucketListCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
