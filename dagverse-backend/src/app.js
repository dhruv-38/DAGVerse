import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import { createClient } from 'redis';
// import { RedisStore } from 'connect-redis';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import executeRoutes from './routes/execute.js';
import uploadRoutes from './routes/upload.js';
// Removed: import solutionRoutes from './routes/solution.js';

dotenv.config();
console.log("MONGODB_URI:", process.env.MONGODB_URI);

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// const redisClient = createClient({ 
//   url: process.env.REDIS_URL,
//   legacyMode: true
// });
// redisClient.connect().catch(console.error);

app.use(cors());
app.use(express.json());
// app.use(
//   session({
//     store: new RedisStore({ client: redisClient }),
//     secret: process.env.JWT_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
//   })
// );

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/execute', executeRoutes);
app.use('/api', uploadRoutes);
// Removed: app.use('/api', solutionRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'DAGVerse Backend is running' });
});

// Add your route imports and use statements here

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    server.listen(process.env.PORT || 8000, () => {
      console.log('Server running');
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));
