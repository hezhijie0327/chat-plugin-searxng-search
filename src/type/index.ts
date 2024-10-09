export interface SearchParameters {
  categories?: any;
  engines?: any;
  format?: string;
  language?: string;
  pageno?: number;
  q: string;
  safesearch?: number;
  time_range?: string;
}

export interface Settings {
  SEARXNG_INSTANCE_URL: string;
  SEARXNG_MAX_RESULTS?: number;
}
