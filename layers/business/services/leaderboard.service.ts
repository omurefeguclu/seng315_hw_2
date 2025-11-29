// Business Layer - Leaderboard Service
import { dbContext, DbContext, UserScore } from '@/layers/data-access';

export interface ILeaderboardService {
  getTopPlayers(limit?: number): Promise<UserScore[]>;
}

export class LeaderboardService implements ILeaderboardService {
  constructor(private readonly db: DbContext) {}

  // Get the top players from the userScores table
  async getTopPlayers(limit: number = 10): Promise<UserScore[]> {
    if (limit <= 0) {
      throw new Error('Limit must be a positive number');
    }
    
    return await this.db.userScore.findMany({
      // order by score descending
      orderBy: { score: 'desc' },
      // take only 'limit' number of records from the top
      take: limit,
    });
  }

}

// Provide singleton instance
export const leaderboardService: ILeaderboardService = new LeaderboardService(dbContext);
