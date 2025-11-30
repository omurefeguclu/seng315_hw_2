/* A GET request to return current leaderboard */
/* Return mock constant data for now */
import { leaderboardService } from '@/layers/business';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    if (limit <= 0) {
      return NextResponse.json(
        { error: 'Limit must be bigger than 0' },
        { status: 400 }
      );
    }

    
    const topPlayers = await leaderboardService.getTopPlayers(limit);
    
    return NextResponse.json(topPlayers);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}