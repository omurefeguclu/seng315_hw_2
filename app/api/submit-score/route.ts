/* A POST request with json body with parameters username, score */
/* Handle Data validations! */
/* Return mock constant data for now */
import { scoreProducer } from '@/layers/messaging';
import { NextResponse } from 'next/server';

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