const swaggerJsdoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');

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

// Ensure directory exists - use project root, not script directory
const projectRoot = path.join(__dirname, '..');
const outputDir = path.join(projectRoot, 'public');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write spec to public directory at project root
fs.writeFileSync(
  path.join(outputDir, 'swagger.json'),
  JSON.stringify(swaggerSpec, null, 2)
);

console.log('✅ Swagger spec generated at public/swagger.json');
