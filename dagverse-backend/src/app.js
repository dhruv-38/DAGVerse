import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import executeRoutes from './routes/execute.js';
import uploadRoutes from './routes/upload.js';
import { setupWebSocket } from './websocket.js';

dotenv.config();
console.log("MONGODB_URI:", process.env.MONGODB_URI);

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/execute', executeRoutes);
app.use('/api', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'DAGVerse Backend is running' });
});

// WebSocket setup
setupWebSocket(server);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    server.listen(process.env.PORT || 8000, '0.0.0.0', () => {
      console.log('Server running');
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));
