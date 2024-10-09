import { NextRequest, NextResponse } from "next/server";
import {
  PluginErrorType,
  createErrorResponse,
  getPluginSettingsFromRequest,
} from '@lobehub/chat-plugin-sdk';
import { SearchParameters, Settings } from '@/type';

export async function POST(req: NextRequest) {
  try {
    const settings = getPluginSettingsFromRequest<Settings>(req);
    if (!settings) {
      return createErrorResponse(PluginErrorType.PluginSettingsInvalid, {
        message: 'Plugin settings not found.',
      });      
    }

    const searxngUrl = settings.SEARXNG_INSTANCE_URL;
    if (!searxngUrl) {
      return createErrorResponse(PluginErrorType.PluginSettingsInvalid, {
        message: 'SEARXNG_INSTANCE_URL not found in plugin settings.',
      });
    }
    console.log('SearXNG Instance URL:', searxngUrl);

    const max_results = settings.SEARXNG_MAX_RESULTS ?? 5;
    console.log('Max Results:', max_results);

    const { categories, engines, language, q, safesearch, time_range } = (await req.json()) as SearchParameters;

    const searchParameters: SearchParameters = {
      ...(categories ? { categories: categories.join(',') } : {}),
      ...(engines ? { engines: engines.join(',') } : {}),
      format: 'json',
      ...(language ? { language: language } : {}),
      pageno: 1,
      q,
      ...(safesearch !== undefined ? { safesearch } : {}),
      ...(time_range ? { time_range } : {}),
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

    const results = await response.json();

    const searchAnswers = results.answers.slice(0, max_results);
    console.log('Search Answers:', searchAnswers);

    const searchInfoboxes = results.infoboxes.slice(0, max_results);
    console.log('Search Infoboxes:', searchInfoboxes);

    const searchResults = results.results
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, max_results);
    console.log('Search Results:', searchResults);

    const combinedResults = [...searchAnswers, ...searchInfoboxes, ...searchResults];

    return NextResponse.json(combinedResults);
  } catch (error) {
    return createErrorResponse(PluginErrorType.PluginServerError, error as object);
  }
}
