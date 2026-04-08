"use client";

import { useAuth } from "@clerk/nextjs";
import { useState, useTransition } from "react";
import { CountrySearchResult } from "@/lib/types";
import { addToBucketList } from "@/app/actions/bucket-list";

export function CountryCard({
  country,
  isSaved: initialSaved,
}: {
  country: CountrySearchResult;
  isSaved?: boolean;
}) {
  const { isSignedIn } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(initialSaved ?? false);
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

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200/60 transition-all hover:shadow-lg hover:ring-stone-300/60">
      <div className="relative aspect-[3/2] overflow-hidden bg-stone-100">
        <img
          src={country.flagUrl}
          alt={`Flag of ${country.name}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-slate-900">{country.name}</h3>
        <p className="mt-0.5 text-sm text-muted">{country.officialName}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">
            🏛️ {country.capital}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">
            🌍 {country.region}
          </span>
          {country.population > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
              👥 {country.population.toLocaleString()}
            </span>
          )}
        </div>

        <div className="mt-auto pt-4">
          {!isSignedIn ? (
            <p className="text-xs text-muted">Sign in to save</p>
          ) : saved ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-600">
              ✓ Saved to Bucket List
            </span>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={isPending}
                className="w-full rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-teal-600 hover:to-teal-700 active:scale-[0.98] disabled:opacity-60"
              >
                {isPending ? "Saving..." : "＋ Add to Bucket List"}
              </button>
              {error && (
                <p className="mt-2 text-xs text-danger">{error}</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
