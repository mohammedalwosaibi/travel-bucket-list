import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { getCountryByCode, getCountryNames } from "@/app/actions/countries";
import { createServerSupabaseClient } from "@/lib/supabase";
import { CountryDetailSaveButton } from "@/app/components/country-detail-save-button";

export default async function CountryDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const country = await getCountryByCode(code.toUpperCase());
  if (!country) notFound();

  let isSaved = false;
  const { userId } = await auth();
  if (userId) {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("bucket_list")
      .select("id")
      .eq("user_id", userId)
      .eq("country_code", country.code)
      .limit(1);
    isSaved = (data?.length ?? 0) > 0;
  }

  const borderNames = await getCountryNames(country.borders);

  return (
    <div className="pb-20">
      {/* Hero flag banner */}
      <div className="relative h-64 overflow-hidden bg-stone-200 sm:h-80 lg:h-96">
        <img
          src={country.flagUrl}
          alt={`Flag of ${country.name}`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-8 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30"
            >
              ← Back
            </Link>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {country.name}
            </h1>
            <p className="mt-1 text-lg text-white/80">
              {country.officialName}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Quick stats bar */}
        <div className="-mt-6 relative z-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard emoji="🏛️" label="Capital" value={country.capital} />
          <StatCard emoji="🌍" label="Region" value={`${country.subregion || country.region}`} />
          <StatCard
            emoji="👥"
            label="Population"
            value={country.population.toLocaleString()}
          />
          <StatCard
            emoji="📐"
            label="Area"
            value={`${country.area.toLocaleString()} km²`}
          />
        </div>

        {/* Save button */}
        <div className="mt-8">
          <CountryDetailSaveButton
            country={{
              name: country.name,
              officialName: country.officialName,
              code: country.code,
              capital: country.capital,
              flagUrl: country.flagUrl,
              region: country.region,
              subregion: country.subregion,
              population: country.population,
            }}
            isSaved={isSaved}
          />
        </div>

        {/* Detail sections */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {/* Languages */}
          {country.languages.length > 0 && (
            <DetailSection title="🗣️ Languages">
              <div className="flex flex-wrap gap-2">
                {country.languages.map((lang) => (
                  <span
                    key={lang}
                    className="rounded-full bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </DetailSection>
          )}

          {/* Currencies */}
          {country.currencies.length > 0 && (
            <DetailSection title="💰 Currencies">
              <div className="flex flex-wrap gap-2">
                {country.currencies.map((cur) => (
                  <span
                    key={cur.name}
                    className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700"
                  >
                    {cur.name}{cur.symbol ? ` (${cur.symbol})` : ""}
                  </span>
                ))}
              </div>
            </DetailSection>
          )}

          {/* Timezones */}
          {country.timezones.length > 0 && (
            <DetailSection title="🕐 Timezones">
              <div className="flex flex-wrap gap-2">
                {country.timezones.map((tz) => (
                  <span
                    key={tz}
                    className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700"
                  >
                    {tz}
                  </span>
                ))}
              </div>
            </DetailSection>
          )}

          {/* Quick facts */}
          <DetailSection title="📋 Quick Facts">
            <div className="space-y-2 text-sm">
              <Fact label="Continent" value={country.continents.join(", ")} />
              <Fact label="Independent" value={country.independent ? "Yes" : "No"} />
              <Fact label="UN Member" value={country.unMember ? "Yes" : "No"} />
              <Fact label="Drives on" value={country.drivingSide === "right" ? "Right side" : "Left side"} />
              <Fact label="Week starts" value={country.startOfWeek.charAt(0).toUpperCase() + country.startOfWeek.slice(1)} />
            </div>
          </DetailSection>
        </div>

        {/* Bordering countries */}
        {country.borders.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              🗺️ Bordering Countries
            </h2>
            <div className="flex flex-wrap gap-2">
              {country.borders.map((borderCode) => (
                <Link
                  key={borderCode}
                  href={`/country/${borderCode}`}
                  className="rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-teal-50 hover:text-teal-700"
                >
                  {borderNames[borderCode] ?? borderCode}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Map link */}
        {country.mapUrl && (
          <div className="mt-10">
            <a
              href={country.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-4 shadow-sm ring-1 ring-stone-200/60 transition-all hover:shadow-md"
            >
              <span className="text-2xl">📍</span>
              <div>
                <p className="font-semibold text-slate-900">
                  View on Google Maps
                </p>
                <p className="text-sm text-muted">
                  Explore {country.name} on the map
                </p>
              </div>
              <span className="ml-2 text-muted">→</span>
            </a>
          </div>
        )}

        {/* Coat of arms */}
        {country.coatOfArmsUrl && (
          <div className="mt-10">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              🏅 Coat of Arms
            </h2>
            <div className="inline-block rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200/60">
              <img
                src={country.coatOfArmsUrl}
                alt={`Coat of arms of ${country.name}`}
                className="h-40 w-auto"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  emoji,
  label,
  value,
}: {
  emoji: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200/60">
      <span className="text-lg">{emoji}</span>
      <p className="mt-1 text-xs font-medium text-muted">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-slate-900">{value}</p>
    </div>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200/60">
      <h2 className="mb-3 text-lg font-bold text-slate-900">{title}</h2>
      {children}
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted">{label}</span>
      <span className="font-medium text-slate-900">{value}</span>
    </div>
  );
}
