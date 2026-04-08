"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase";
import { CountrySearchResult, BucketListItem } from "@/lib/types";

export async function addToBucketList(
  country: CountrySearchResult
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "You must be signed in" };

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("bucket_list").insert({
    user_id: userId,
    country_name: country.name,
    country_code: country.code,
    capital: country.capital,
    flag_url: country.flagUrl,
    region: country.region,
    population: country.population,
    notes: "",
  });

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "Already in your bucket list" };
    }
    return { success: false, error: "Failed to save. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function removeFromBucketList(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "You must be signed in" };

  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("bucket_list")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    return { success: false, error: "Failed to remove. Please try again." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/");
  return { success: true };
}

export async function updateNotes(
  id: string,
  notes: string
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "You must be signed in" };

  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("bucket_list")
    .update({ notes })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    return { success: false, error: "Failed to update notes." };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export interface PopularCountry {
  country_name: string;
  country_code: string;
  flag_url: string | null;
  capital: string | null;
  region: string | null;
  save_count: number;
}

export async function getPopularCountries(): Promise<PopularCountry[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.rpc("get_popular_countries");

  if (error || !data) return [];
  return data as PopularCountry[];
}

export async function getBucketList(): Promise<BucketListItem[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("bucket_list")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return [];
  return data as BucketListItem[];
}
