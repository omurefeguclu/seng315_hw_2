import { leaderboardService } from '@/layers/business';
import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/leaderboard:
 *   get:
 *     tags:
 *       - Leaderboard
 *     summary: Get top players from leaderboard
 *     description: Returns a list of top players sorted by score
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of top players to return
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   score:
 *                     type: integer
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Invalid limit parameter
 *       500:
 *         description: Server error
 */
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