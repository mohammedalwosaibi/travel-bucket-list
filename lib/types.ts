export interface BucketListItem {
  id: string;
  user_id: string;
  country_name: string;
  country_code: string;
  capital: string | null;
  flag_url: string | null;
  region: string | null;
  population: number | null;
  notes: string;
  created_at: string;
}

export interface CountrySearchResult {
  name: string;
  officialName: string;
  code: string;
  capital: string;
  flagUrl: string;
  region: string;
  subregion: string;
  population: number;
}
