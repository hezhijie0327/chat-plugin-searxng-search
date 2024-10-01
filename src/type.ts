export interface SearchParameters {
  q: string;
  format?: string;
  language?: string;
  time_range?: string;
  pageno?: number;
  max_results?: number;
}

export interface SearchResult {
  url: string;
  title: string;
  content: string;
  engine: string;
  score?: number;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
}

export interface Settings {
  SEARXNG_INSTANCE_URL: string;
}
