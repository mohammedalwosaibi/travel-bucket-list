import { auth } from "@clerk/nextjs/server";
import { Hero } from "./components/hero";
import { CountrySearch } from "./components/country-search";
import { createServerSupabaseClient } from "@/lib/supabase";

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

  return (
    <div className="pb-20">
      <Hero />
      <CountrySearch savedCodes={savedCodes} />
    </div>
  );
}
