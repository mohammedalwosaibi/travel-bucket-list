"use server";

import { CountrySearchResult } from "@/lib/types";

export async function searchCountries(
  query: string
): Promise<CountrySearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  try {
    const res = await fetch(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(trimmed)}?fields=name,cca2,capital,flags,region,subregion,population`,
      { next: { revalidate: 3600 } }
    );

    if (res.status === 404) return [];
    if (!res.ok) throw new Error("Failed to fetch countries");

    const data = await res.json();

    return data.map(
      (country: {
        name: { common: string; official: string };
        cca2: string;
        capital?: string[];
        flags: { svg: string };
        region: string;
        subregion: string;
        population: number;
      }): CountrySearchResult => ({
        name: country.name.common,
        officialName: country.name.official,
        code: country.cca2,
        capital: country.capital?.[0] ?? "N/A",
        flagUrl: country.flags.svg,
        region: country.region,
        subregion: country.subregion ?? "",
        population: country.population,
      })
    );
  } catch {
    return [];
  }
}
