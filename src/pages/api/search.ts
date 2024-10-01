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
    const { language, q, time_range} = (await req.json()) as SearchParameters;

    const searxngUrl = settings.SEARXNG_INSTANCE_URL;
    console.log('SearXNG Instance URL:', searxngUrl);

    const searchParameters: SearchParameters = {
      format: 'json',
      language: language ?? 'en-US',
      max_results: 5,
      pageno: 1,
      q,
      time_range: time_range ?? 'month',
    };
    console.log('Search Parameters:', searchParams);

    const searchParams = new URLSearchParams(
      Object.entries(searchParameters).reduce<Record<string, string>>((acc, [key, value]) => {
        acc[key] = typeof value === 'string' ? value : JSON.stringify(value);
        return acc;
      }, {})
    ).toString();
    //console.log('Search URL:', searxngUrl, '?', searchParams);

    const response = await fetch(searxngUrl, {
      body: searchParams,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });

    let results = (await response.json()) as SearchResponse;

    // Limit the results to 5
    results.results = results.results.slice(0, 5);

    return new Response(JSON.stringify(results));
  } catch (error) {
    return createErrorResponse(PluginErrorType.PluginServerError, error as object);
  }
};
