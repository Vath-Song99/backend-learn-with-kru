import express from 'express';
import { healthRoutes } from './routes';

const app = express();

// Health Route [Not via API Gateway]
app.use('', healthRoutes);

export default app;
