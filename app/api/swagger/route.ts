import { NextResponse } from 'next/server';
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Game Leaderboard API',
      version: '1.0.0',
      description: 'A leaderboard system with Redis Stream processing for score submissions',
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
        description: 'API Server',
      },
    ],
    tags: [
      {
        name: 'Leaderboard',
        description: 'Leaderboard operations',
      },
      {
        name: 'Scores',
        description: 'Score submission operations',
      },
    ],
  },
  apis: ['./app/api/**/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export async function GET() {
  return NextResponse.json(swaggerSpec);
}
