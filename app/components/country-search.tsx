"use client";

import { useRef, useState, useTransition } from "react";
import { CountrySearchResult } from "@/lib/types";
import { searchCountries } from "@/app/actions/countries";
import { CountryCard } from "./country-card";

export function CountrySearch({
  savedCodes,
  hasPopularCountries,
}: {
  savedCodes?: string[];
  hasPopularCountries?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CountrySearchResult[]>([]);
  const [isPending, startTransition] = useTransition();
  const [hasSearched, setHasSearched] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedSet = new Set(savedCodes ?? []);

  function handleChange(value: string) {
    setQuery(value);

    if (timerRef.current) clearTimeout(timerRef.current);

    if (value.trim().length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    timerRef.current = setTimeout(() => {
      startTransition(async () => {
        const data = await searchCountries(value);
        setResults(data);
        setHasSearched(true);
      });
    }, 300);
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <div className="relative -mt-7 mx-auto max-w-2xl">
        <div className="flex items-center overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-stone-200/60">
          <span className="pl-5 text-xl text-muted">🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Search for a country... (e.g. Japan, Brazil)"
            className="w-full bg-transparent px-4 py-4 text-lg outline-none placeholder:text-stone-400"
          />
          {isPending && (
            <div className="mr-4 h-5 w-5 animate-spin rounded-full border-2 border-stone-300 border-t-primary" />
          )}
        </div>
      </div>

      {results.length > 0 && (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((country) => (
            <CountryCard
              key={country.code}
              country={country}
              isSaved={savedSet.has(country.code)}
            />
          ))}
        </div>
      )}

      {hasSearched && results.length === 0 && !isPending && (
        <div className="mt-16 text-center">
          <span className="text-4xl">🗺️</span>
          <p className="mt-3 text-lg font-medium text-slate-700">
            No countries found
          </p>
          <p className="mt-1 text-sm text-muted">
            Try a different search term
          </p>
        </div>
      )}

      {!hasSearched && results.length === 0 && !hasPopularCountries && (
        <div className="mt-16 text-center">
          <span className="text-4xl">🧭</span>
          <p className="mt-3 text-lg font-medium text-slate-700">
            Start exploring
          </p>
          <p className="mt-1 text-sm text-muted">
            Type a country name above to discover your next destination
          </p>
        </div>
      )}
    </section>
  );
}
