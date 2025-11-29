// Data Access Layer - DbContext (Inspired by EF Core .NET)
import { prisma } from '@/lib/prisma';

/**
 * DbContext provides direct simplified access to Prisma entities
 * This acts as the data access layer for the application
 * No separate repository pattern is used to avoid unnecessary abstraction
 */
export const dbContext = {
  userScore: prisma.userScore,
};

export type DbContext = typeof dbContext;

/* Also export model types */
export type { UserScore } from '@/lib/prisma/generated/client';