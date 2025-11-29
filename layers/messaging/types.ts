
export interface ScoreMessage {
  username: string;
  points: number;
}

export type AcknowledgableMessage<T> = T & { ack: () => Promise<void> };
export type RedisStreamEntry = [id: string, fields: string[]];
export type RedisStream = [streamName: string, entries: RedisStreamEntry[]];
export type RedisStreamResponse = RedisStream[] | null;
