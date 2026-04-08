"use client";

import { useAuth } from "@clerk/nextjs";
import { useState, useTransition } from "react";
import { CountrySearchResult } from "@/lib/types";
import { addToBucketList } from "@/app/actions/bucket-list";

export function CountryDetailSaveButton({
  country,
  isSaved: initialSaved,
}: {
  country: CountrySearchResult;
  isSaved: boolean;
}) {
  const { isSignedIn } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(initialSaved);
  const [error, setError] = useState<string | null>(null);

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const result = await addToBucketList(country);
      if (result.error) {
        setError(result.error);
      } else {
        setSaved(true);
      }
    });
  }

  if (!isSignedIn) {
    return (
      <p className="text-sm text-muted">
        Sign in to add this country to your bucket list
      </p>
    );
  }

  if (saved) {
    return (
      <div className="inline-flex items-center gap-2 rounded-2xl bg-teal-50 px-5 py-3 text-sm font-semibold text-teal-700 ring-1 ring-teal-200/60">
        ✓ Saved to your Bucket List
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleSave}
        disabled={isPending}
        className="rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:from-teal-600 hover:to-teal-700 active:scale-[0.98] disabled:opacity-60"
      >
        {isPending ? "Saving..." : "＋ Add to Bucket List"}
      </button>
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </div>
  );
}
