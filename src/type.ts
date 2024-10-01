export interface SearchParameters {
  q: string;
  format?: string;
  language?: string;
  time_range?: string;
  safesearch?: number;
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
  number_of_results: number;
  results: SearchResult[];
  answers: string[];
  corrections: string[];
  infoboxes: any[];
  suggestions: string[];
  unresponsive_engines: string[];
}

export interface Settings {
  SEARXNG_INSTANCE_URL: string;
}
