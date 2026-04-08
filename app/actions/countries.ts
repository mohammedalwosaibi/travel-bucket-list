"use server";

import { CountrySearchResult } from "@/lib/types";

export interface CountryDetail {
  name: string;
  officialName: string;
  code: string;
  capital: string;
  flagUrl: string;
  coatOfArmsUrl: string;
  region: string;
  subregion: string;
  population: number;
  area: number;
  languages: string[];
  currencies: { name: string; symbol: string }[];
  timezones: string[];
  continents: string[];
  borders: string[];
  mapUrl: string;
  independent: boolean;
  unMember: boolean;
  startOfWeek: string;
  drivingSide: string;
}

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

export async function getCountryByCode(
  code: string
): Promise<CountryDetail | null> {
  try {
    const res = await fetch(
      `https://restcountries.com/v3.1/alpha/${encodeURIComponent(code)}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) return null;

    const data = await res.json();
    const c = Array.isArray(data) ? data[0] : data;

    const languages = c.languages
      ? Object.values(c.languages as Record<string, string>)
      : [];

    const currencies = c.currencies
      ? Object.values(
          c.currencies as Record<string, { name: string; symbol: string }>
        ).map((cur) => ({ name: cur.name, symbol: cur.symbol ?? "" }))
      : [];

    return {
      name: c.name?.common ?? code,
      officialName: c.name?.official ?? "",
      code: c.cca2 ?? code,
      capital: c.capital?.[0] ?? "N/A",
      flagUrl: c.flags?.svg ?? "",
      coatOfArmsUrl: c.coatOfArms?.svg ?? "",
      region: c.region ?? "",
      subregion: c.subregion ?? "",
      population: c.population ?? 0,
      area: c.area ?? 0,
      languages,
      currencies,
      timezones: c.timezones ?? [],
      continents: c.continents ?? [],
      borders: c.borders ?? [],
      mapUrl: c.maps?.googleMaps ?? "",
      independent: c.independent ?? false,
      unMember: c.unMember ?? false,
      startOfWeek: c.startOfWeek ?? "",
      drivingSide: c.car?.side ?? "",
    };
  } catch {
    return null;
  }
}

export async function getCountryNames(
  codes: string[]
): Promise<Record<string, string>> {
  if (codes.length === 0) return {};
  try {
    const res = await fetch(
      `https://restcountries.com/v3.1/alpha?codes=${codes.join(",")}&fields=cca2,name`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return {};
    const data = await res.json();
    const map: Record<string, string> = {};
    for (const c of data) {
      map[c.cca2] = c.name.common;
    }
    return map;
  } catch {
    return {};
  }
}
