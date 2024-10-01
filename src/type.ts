export interface SearchParameters {
  q: string;
  format?: string;
  language?: string;
  time_range?: string;
  safesearch?: number;
  pageno?: number;
  max_results?: number;
  categories?: string;
  engines?: string;
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
