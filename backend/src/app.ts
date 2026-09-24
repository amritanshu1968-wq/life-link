import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'LIFE-LINK Primary Node.js API',
    timestamp: new Date().toISOString(),
  });
});

// Master API Routes
app.use('/api', routes);

// Global Error Handler
app.use(errorHandler);

export default app;
