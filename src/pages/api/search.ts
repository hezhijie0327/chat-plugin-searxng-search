import {
  PluginErrorType,
  createErrorResponse,
  getPluginSettingsFromRequest,
} from '@lobehub/chat-plugin-sdk';

import { SearchParameters, SearchResponse, Settings } from '@/type';

export const config = {
  runtime: 'edge',
};

export default async (req: Request) => {
  if (req.method !== 'POST') return createErrorResponse(PluginErrorType.MethodNotAllowed);

  const settings = getPluginSettingsFromRequest<Settings>(req);
  if (!settings)
    return createErrorResponse(PluginErrorType.PluginSettingsInvalid, {
      message: 'Plugin settings not found.',
    });

  try {
    const { q, language, time_range, safesearch, categories, engines} = (await req.json()) as SearchParameters;

    if (!q) {
      return createErrorResponse(PluginErrorType.PluginApiParamsError, {
        message: 'Search query (q) is required.',
      });
    }

    const searchParameters: SearchParameters = {
      q,
      format: 'json',
      language: language ?? 'en-US',
      time_range: time_range ?? 'month',
      safesearch: safesearch ?? 0,
      pageno: 1,
      max_results: 5,
      ...(categories && { categories }),
      ...(engines && { engines }),
    };

    const searxngUrl = settings.SEARXNG_INSTANCE_URL;

    // Convert searchParameters to string values
    const searchParams = new URLSearchParams(
      Object.entries(searchParameters).reduce<Record<string, string>>((acc, [key, value]) => {
        acc[key] = typeof value === 'string' ? value : JSON.stringify(value);
        return acc;
      }, {})
    ).toString();

    const response = await fetch(`${searxngUrl}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: searchParams,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let results = (await response.json()) as SearchResponse;

    // Limit the results to 5
    results.results = results.results.slice(0, 5);

    return new Response(JSON.stringify(results));
  } catch (error) {
    return createErrorResponse(PluginErrorType.PluginServerError, error as object);
  }
};
