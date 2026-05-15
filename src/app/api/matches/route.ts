import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * GET /api/matches
 *
 * Proxy to api-football-v1.p.rapidapi.com /fixtures for World Cup 2026.
 * Keeps LIVESCORE_API_KEY server-side (never sent to the browser).
 *
 * Query params forwarded:
 *   date   - ISO date string (YYYY-MM-DD)
 *   status - MatchStatus code (e.g. "1H", "FT")
 *   league - numeric league ID (defaults to FIFA World Cup)
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

  // Build upstream query params
  const params = new URLSearchParams({
    league: searchParams.get('league') ?? '1', // 1 = FIFA World Cup
    season: '2026',
  });

  const date = searchParams.get('date');
  if (date) params.set('date', date);

  const status = searchParams.get('status');
  if (status) params.set('status', status);

  try {
    const res = await fetch(`${baseUrl}/fixtures?${params.toString()}`, {
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
