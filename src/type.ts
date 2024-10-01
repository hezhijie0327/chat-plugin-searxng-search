export interface SearchParameters {
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
  MAX_RESULTS: number;
  SEARXNG_INSTANCE_URL: string;
}
