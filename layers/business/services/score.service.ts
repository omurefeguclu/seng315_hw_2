// Business Layer - Score Service
import { dbContext, DbContext, UserScore } from '@/layers/data-access';

export interface ScoreSubmission {
  username: string;
  points: number;
}

export interface IScoreService {
  processScore(submission: ScoreSubmission): Promise<UserScore>;
}

export class ScoreService implements IScoreService {
  constructor(private readonly db: DbContext) {}

  // Score submission validation
  private validateScoreSubmission(submission: ScoreSubmission): void {
    // TODO: Implement a robust business validation logic for submission entity here
  }

  // Process the score submission
  async processScore(submission: ScoreSubmission): Promise<UserScore> {
    // Validate the submission
    this.validateScoreSubmission(submission);
    
    // Upsert the user score
    // If user exists, increment score; else create new record
    return await this.db.userScore.upsert({
      where: { username: submission.username.trim() },
      update: { score: { increment: submission.points } },
      create: { username: submission.username.trim(), score: submission.points },
    });
  }
}

// Provide singleton instance
export const scoreService = new ScoreService(dbContext);
