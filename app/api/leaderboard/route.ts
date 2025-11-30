/* A GET request to return current leaderboard */
/* Return mock constant data for now */
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

    return NextResponse.json(Array.from({ length: limit }, (_, i) => ({
      rank: i + 1,
      username: `user${i + 1}`,
      score: Math.floor(Math.random() * 1000),
    })));
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}