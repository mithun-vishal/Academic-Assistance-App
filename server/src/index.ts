import express from 'express';
import dotenv from 'dotenv';
import resourceRoutes from './routes/resourceRoutes';
import { connectDB } from './config/db';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// API routes
app.use('/api/resources', resourceRoutes);

// Connect to database then start server
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});
