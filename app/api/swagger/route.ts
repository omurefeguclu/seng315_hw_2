import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  // In production, read the generated swagger.json
  if (process.env.NODE_ENV === 'production') {
    const swaggerPath = path.join(process.cwd(), 'public', 'swagger.json');
    if (fs.existsSync(swaggerPath)) {
      const swaggerSpec = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'));
      return NextResponse.json(swaggerSpec);
    }
  }

  // In development, generate spec dynamically
  if (process.env.NODE_ENV === 'development') {
    try {
      // Dynamic import for dev-only dependency
      const swaggerJsdoc = (await import('swagger-jsdoc')).default;
      
      const options = {
        definition: {
          openapi: '3.0.0',
          info: {
            title: 'Game Leaderboard API',
            version: '1.0.0',
            description: 'A leaderboard system with Redis Stream processing for score submissions',
          },
          servers: [
            {
              url: '/',
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
        apis: ['./app/api/**/route.ts'],
      };

      const swaggerSpec = swaggerJsdoc(options);
      return NextResponse.json(swaggerSpec);
    } catch (error) {
      console.error('Failed to generate swagger spec:', error);
      // Fall through to fallback
    }
  }

  // Fallback spec if generation fails
  const fallbackSpec = {
    openapi: '3.0.0',
    info: {
      title: 'Game Leaderboard API',
      version: '1.0.0',
      description: 'A leaderboard system with Redis Stream processing for score submissions',
    },
    servers: [
      {
        url: '/',
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
    paths: {
      '/api/leaderboard': {
        get: {
          tags: ['Leaderboard'],
          summary: 'Get top players from leaderboard',
          description: 'Returns a list of top players sorted by score',
          parameters: [
            {
              in: 'query',
              name: 'limit',
              schema: {
                type: 'integer',
                default: 10,
              },
              description: 'Number of top players to return',
            },
          ],
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'integer' },
                        username: { type: 'string' },
                        score: { type: 'integer' },
                        updatedAt: { type: 'string', format: 'date-time' },
                      },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Invalid limit parameter',
            },
            '500': {
              description: 'Server error',
            },
          },
        },
      },
      '/api/submit-score': {
        post: {
          tags: ['Scores'],
          summary: 'Submit a player score',
          description: 'Submit a score for a player. The score is queued for processing via Redis Stream',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['username', 'score'],
                  properties: {
                    username: {
                      type: 'string',
                      description: 'Player username',
                      example: 'player1',
                    },
                    score: {
                      type: 'number',
                      description: 'Score points to add',
                      example: 100,
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Score successfully queued',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'queued' },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Invalid request body',
            },
            '500': {
              description: 'Server error',
            },
          },
        },
      },
    },
  };

  return NextResponse.json(fallbackSpec);
}
