import { WebSocketServer } from 'ws';

const sessions = new Map(); // sessionId -> Set of WebSocket connections

export function setupWebSocket(server) {
  const wss = new WebSocketServer({ 
    server
  });
  wss.on('error', (err) => {
    console.error('WebSocket server error:', err);
  });

  wss.on('connection', (ws, req) => {
    const sessionId = req.url.split('/').pop();
    
    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, new Set());
    }
    
    const sessionConnections = sessions.get(sessionId);
    sessionConnections.add(ws);

    // Broadcast user joined to all users (including the new joiner)
    broadcast(sessionId, {
      type: 'user_joined',
      activeUsers: sessionConnections.size
    });

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        // Broadcast to all other connections in the session
        broadcast(sessionId, message, ws);
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      sessionConnections.delete(ws);
      
      // Broadcast user left
      broadcast(sessionId, {
        type: 'user_left',
        activeUsers: sessionConnections.size
      });
      
      // Clean up empty sessions
      if (sessionConnections.size === 0) {
        sessions.delete(sessionId);
      }
    });
  });

  function broadcast(sessionId, message, excludeWs = null) {
    const sessionConnections = sessions.get(sessionId);
    if (!sessionConnections) return;

    sessionConnections.forEach(client => {
      if (client !== excludeWs && client.readyState === 1) {
        client.send(JSON.stringify(message));
      }
    });
  }
} 