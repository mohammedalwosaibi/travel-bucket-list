"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useState, useTransition } from "react";
import { PopularCountry } from "@/app/actions/bucket-list";
import { addToBucketList } from "@/app/actions/bucket-list";

export function PopularCountries({
  countries,
  savedCodes,
}: {
  countries: PopularCountry[];
  savedCodes: string[];
}) {
  if (countries.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          🔥 Trending Destinations
        </h2>
        <p className="mt-2 text-muted">
          The most popular countries on everyone&apos;s bucket list
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {countries.map((country) => (
          <PopularCountryCard
            key={country.country_code}
            country={country}
            isSaved={savedCodes.includes(country.country_code)}
          />
        ))}
      </div>
    </section>
  );
}

function PopularCountryCard({
  country,
  isSaved: initialSaved,
}: {
  country: PopularCountry;
  isSaved: boolean;
}) {
  const { isSignedIn } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(initialSaved);

  function handleSave() {
    startTransition(async () => {
      const result = await addToBucketList({
        name: country.country_name,
        officialName: country.country_name,
        code: country.country_code,
        capital: country.capital ?? "N/A",
        flagUrl: country.flag_url ?? "",
        region: country.region ?? "",
        subregion: "",
        population: 0,
      });
      if (result.success) setSaved(true);
    });
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200/60 transition-all hover:shadow-lg hover:ring-stone-300/60">
      {country.flag_url && (
        <Link href={`/country/${country.country_code}`} className="relative aspect-[3/2] overflow-hidden bg-stone-100">
          <img
            src={country.flag_url}
            alt={`Flag of ${country.country_name}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {country.save_count} {country.save_count === 1 ? "save" : "saves"}
          </div>
        </Link>
      )}

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/country/${country.country_code}`} className="hover:underline">
          <h3 className="font-bold text-slate-900">{country.country_name}</h3>
        </Link>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {country.capital && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-medium text-teal-700">
              🏛️ {country.capital}
            </span>
          )}
          {country.region && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700">
              🌍 {country.region}
            </span>
          )}
        </div>

        <div className="mt-auto pt-3">
          {!isSignedIn ? (
            <p className="text-[11px] text-muted">Sign in to save</p>
          ) : saved ? (
            <span className="text-xs font-medium text-teal-600">✓ Saved</span>
          ) : (
            <button
              onClick={handleSave}
              disabled={isPending}
              className="w-full rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:from-teal-600 hover:to-teal-700 active:scale-[0.98] disabled:opacity-60"
            >
              {isPending ? "Saving..." : "＋ Add"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
