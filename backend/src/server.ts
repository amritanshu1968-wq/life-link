import app from './app';
import { config } from './config';
import { prisma } from './config/db';

const server = app.listen(config.port, () => {
  console.log(`🚀 LIFE-LINK Backend API running at http://localhost:${config.port}`);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await prisma.$disconnect();
  server.close(() => {
    console.log('HTTP server closed');
  });
});
