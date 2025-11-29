// Messaging Layer - Score Consumer
import { redis } from '@/lib/redis';
import { AcknowledgableMessage, RedisStreamResponse, ScoreMessage } from '../types';

export interface IScoreConsumer {
  initialize(): Promise<void>;
  readMessages(count?: number, blockMs?: number): Promise<AcknowledgableMessage<ScoreMessage>[]>;
}

export class ScoreConsumer implements IScoreConsumer {
  private readonly streamKey: string;
  private readonly groupName: string;
  private readonly consumerName: string;

  constructor(
    streamKey: string = 'game_scores',
    groupName: string = 'score_service_group',
    consumerName: string = 'worker_1'
  ) {
    this.streamKey = streamKey;
    this.groupName = groupName;
    this.consumerName = consumerName;
  }

  // Initialize the consumer, handle the necessary setup
  async initialize(): Promise<void> {

    try {
      // Try to create consumer group, starting from the latest message ($)
      await redis.xgroup('CREATE', this.streamKey, this.groupName, '$', 'MKSTREAM');
    } catch {
      // It it throws, that means the group already exists, ignore error
    }
  }

  // Read messages from the redis consuming stream
  // Returns strongly typed ScoreMessage array with message IDs
  async readMessages(count: number = 1, blockMs: number = 5000): Promise<AcknowledgableMessage<ScoreMessage>[]> {
    const streams = await redis.xreadgroup(
      'GROUP',
      this.groupName,
      this.consumerName,
      'COUNT',
      count,
      'BLOCK',
      blockMs,
      'STREAMS',
      this.streamKey,
      '>'
    ) as RedisStreamResponse;

    if (!streams || streams.length === 0) {
      return [];
    }

    const messages: AcknowledgableMessage<ScoreMessage>[] = [];
    const [, entries] = streams[0];

    for (const [id, fields] of entries) {
      // Parse fields array: [key1, val1, key2, val2, ...]
      const message: AcknowledgableMessage<ScoreMessage> = {
        username: fields[1], // username is at index 1
        points: parseInt(fields[3]), // points is at index 3
        ack: async () => {
          await redis.xack(this.streamKey, this.groupName, id);
        }
      };

      messages.push(message);
    }

    return messages;
  }

}

// Singleton instance
export const scoreConsumer: IScoreConsumer = new ScoreConsumer();
