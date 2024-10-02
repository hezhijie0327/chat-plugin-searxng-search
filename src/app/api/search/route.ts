import { NextRequest, NextResponse } from "next/server";
import {
  PluginErrorType,
  createErrorResponse,
  getPluginSettingsFromRequest,
} from '@lobehub/chat-plugin-sdk';
import { SearchParameters, Settings } from '@/type';

export async function POST(req: NextRequest) {
  const settings = getPluginSettingsFromRequest<Settings>(req);
  if (!settings)
    return createErrorResponse(PluginErrorType.PluginSettingsInvalid, {
      message: 'Plugin settings not found.',
    });

  try {
    const searxngUrl = settings.SEARXNG_INSTANCE_URL;
    if (!searxngUrl)
      return createErrorResponse(PluginErrorType.PluginSettingsInvalid, {
        message: 'SEARXNG_INSTANCE_URL not found in plugin settings.',
      });
    console.log('SearXNG Instance URL:', searxngUrl);

    const max_results = settings.SEARXNG_MAX_RESULTS ?? 5;
    console.log('Max Results:', max_results);

    const { categories, language, q, safesearch, time_range } = (await req.json()) as SearchParameters;

    const searchParameters: SearchParameters = {
      categories: categories ?? 'general',
      format: 'json',
      language: language ?? 'en-US',
      pageno: 1,
      q,
      safesearch: safesearch ?? 0,
      time_range: time_range ?? 'month',
    };
    console.log('Search Parameters:', searchParameters);

    const searchParams = new URLSearchParams(
      Object.entries(searchParameters).reduce<Record<string, string>>((acc, [key, value]) => {
        acc[key] = typeof value === 'string' ? value : JSON.stringify(value);
        return acc;
      }, {})
    ).toString();
    console.log('URL Search Params:', searchParams);

    const response = await fetch(searxngUrl, {
      body: searchParams,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });

    let results = await response.json();
    results.results = results.results.slice(0, max_results);
    console.log('Search Results:', results.results);

    return NextResponse.json(results.results);
  } catch (error) {
    return createErrorResponse(PluginErrorType.PluginServerError, error as object);
  }
}
