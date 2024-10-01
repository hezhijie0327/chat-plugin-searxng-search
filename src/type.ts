export interface SearchParameters {
  format?: string;
  language?: string;
  max_results?: number;
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
  SEARXNG_INSTANCE_URL: string;
}
