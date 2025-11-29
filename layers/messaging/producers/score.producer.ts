// Messaging Layer - Score Producer
import { redis } from '@/lib/redis';
import { ScoreMessage } from '../types';

export interface IScoreProducer {
  publishScore(message: ScoreMessage): Promise<string>;
}

export class ScoreProducer implements IScoreProducer {
  private readonly streamKey: string;
  private readonly maxLength: number;

  constructor(streamKey: string = 'game_scores', maxLength: number = 1000) {
    this.streamKey = streamKey;
    this.maxLength = maxLength;
  }

  // Publish score message to Redis stream
  async publishScore(message: ScoreMessage): Promise<string> {
    const messageId = await redis.xadd(
      this.streamKey,
      'MAXLEN',
      '~',
      this.maxLength,
      '*',
      'username',
      message.username,
      'points',
      message.points.toString()
    );

    return messageId as string;
  }
}

// Singleton instance
export const scoreProducer = new ScoreProducer();
