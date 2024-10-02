export interface SearchParameters {
  categories?: string;
  engines?: string;
  format?: string;
  language?: string;
  pageno?: number;
  q: string;
  time_range?: string;
}

export interface SearchResult {
  content: string;
  engine: string;
  score?: number;
  title: string;
  url: string;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
}

export interface Settings {
  SEARXNG_ENGINE_LIST?: string;
  SEARXNG_INSTANCE_URL: string;
  SEARXNG_MAX_RESULTS?: number;
}
