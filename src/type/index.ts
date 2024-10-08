export interface SearchParameters {
  categories?: string;
  format?: string;
  pageno?: number;
  q: string;
  time_range?: string;
}

export interface Settings {
  SEARXNG_INSTANCE_URL: string;
  SEARXNG_MAX_RESULTS?: number;
}
