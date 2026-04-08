import { auth } from "@clerk/nextjs/server";
import { Hero } from "./components/hero";
import { CountrySearch } from "./components/country-search";
import { PopularCountries } from "./components/popular-countries";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getPopularCountries } from "./actions/bucket-list";

export default async function HomePage() {
  let savedCodes: string[] = [];

  const { userId } = await auth();
  if (userId) {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("bucket_list")
      .select("country_code")
      .eq("user_id", userId);
    savedCodes = data?.map((row) => row.country_code) ?? [];
  }

  const popularCountries = await getPopularCountries();

  return (
    <div className="pb-20">
      <Hero />
      <CountrySearch savedCodes={savedCodes} hasPopularCountries={popularCountries.length > 0} />
      <PopularCountries countries={popularCountries} savedCodes={savedCodes} />
    </div>
  );
}
