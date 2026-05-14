import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * GET /api/topscorers
 *
 * Proxy to api-football-v1.p.rapidapi.com for World Cup 2026 player stats.
 * Keeps LIVESCORE_API_KEY server-side (never sent to the browser).
 *
 * Query params:
 *   type – 'goals' | 'assists' | 'cleansheets' | 'cards'
 *          Maps to the appropriate api-football endpoint.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);

  const apiKey = process.env.LIVESCORE_API_KEY;
  const apiHost =
    process.env.LIVESCORE_API_HOST ?? 'api-football-v1.p.rapidapi.com';
  const baseUrl =
    process.env.LIVESCORE_BASE_URL ??
    'https://api-football-v1.p.rapidapi.com/v3';

  // Stub mode: return empty array when API key is not configured
  if (!apiKey || apiKey === 'your_livescore_api_key_here') {
    return NextResponse.json([] as unknown[]);
  }

  const type = searchParams.get('type') ?? 'goals';

  // Map stat type to the correct api-football endpoint path
  const endpointMap: Record<string, string> = {
    goals: 'players/topscorers',
    assists: 'players/topassists',
    cleansheets: 'players/topscorersbycleansheets',
    cards: 'players/topredcards',
  };

  const endpoint = endpointMap[type] ?? 'players/topscorers';

  const params = new URLSearchParams({
    league: '1', // FIFA World Cup
    season: '2026',
  });

  try {
    const res = await fetch(`${baseUrl}/${endpoint}?${params.toString()}`, {
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': apiHost,
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream API error: ${res.status}` },
        { status: res.status },
      );
    }

    const data = (await res.json()) as { response?: unknown[] };
    return NextResponse.json(data.response ?? []);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to reach Live Score API: ${message}` },
      { status: 502 },
    );
  }
}
