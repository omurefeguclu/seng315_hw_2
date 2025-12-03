import { scoreProducer } from '@/layers/messaging';
import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/submit-score:
 *   post:
 *     tags:
 *       - Scores
 *     summary: Submit a player score
 *     description: Submit a score for a player. The score is queued for processing via Redis Stream
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - score
 *             properties:
 *               username:
 *                 type: string
 *                 description: Player username
 *                 example: "player1"
 *               score:
 *                 type: number
 *                 description: Score points to add
 *                 example: 100
 *     responses:
 *       200:
 *         description: Score successfully queued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "queued"
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Server error
 */
export async function POST(req: Request) {
  try {
    const { username, score } = await req.json();

    // Validate input
    if (!username || typeof username !== 'string') {
      return NextResponse.json(
        { error: 'Username is required and must be a string' },
        { status: 400 }
      );
    }

    if (typeof score !== 'number' || isNaN(score)) {
      return NextResponse.json(
        { error: 'Score must be a valid number' },
        { status: 400 }
      );
    }

    // Publish score message to messaging layer
    await scoreProducer.publishScore({
      username,
      points: score,
    });

    return NextResponse.json({
      status: 'queued'
    });
  } catch (error) {
    console.error('Error submitting score:', error);
    return NextResponse.json(
      { error: 'Failed to submit score' },
      { status: 500 }
    );
  }
}