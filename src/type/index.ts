export interface SearchParameters {
  categories?: any;
  format?: string;
  q: string;
  time_range?: string;
}

export interface Settings {
  SEARXNG_INSTANCE_URL: string;
  SEARXNG_MAX_RESULTS?: number;
}
