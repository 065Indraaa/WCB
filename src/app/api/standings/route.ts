import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * GET /api/standings
 *
 * Proxy to api-football-v1.p.rapidapi.com /standings for World Cup 2026.
 * Keeps LIVESCORE_API_KEY server-side (never sent to the browser).
 *
 * Query params:
 *   group – group letter (e.g. "A") to filter results client-side
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

  const params = new URLSearchParams({
    league: '1', // FIFA World Cup
    season: '2026',
  });

  try {
    const res = await fetch(`${baseUrl}/standings?${params.toString()}`, {
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
    let standings = data.response ?? [];

    // Optional client-requested group filter
    const groupFilter = searchParams.get('group');
    if (groupFilter && Array.isArray(standings)) {
      standings = standings.filter((entry) => {
        const e = entry as { league?: { standings?: unknown[][] } };
        // api-football returns standings grouped by group letter in the
        // league.standings array; filter by group name containing the letter
        const groupName = (e as { group?: string }).group ?? '';
        return groupName.toUpperCase().includes(groupFilter.toUpperCase());
      });
    }

    return NextResponse.json(standings);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to reach Live Score API: ${message}` },
      { status: 502 },
    );
  }
}
