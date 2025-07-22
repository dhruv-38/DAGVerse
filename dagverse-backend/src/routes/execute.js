import express from 'express';
import Docker from 'dockerode';
import { randomBytes } from 'crypto';
import { executeCodeInDocker } from '../services/dockerExecutor.js';

const router = express.Router();
const docker = new Docker();

// In-memory session store: { sessionId: { container, language } }
const sessions = {};

// POST /api/session - Create a session and start a container
router.post('/session', async (req, res) => {
  const { language } = req.body;
  if (!language) return res.status(400).json({ error: 'Missing language' });
  try {
    // Create a minimal container for the session
    const sessionId = randomBytes(8).toString('hex');
    let image, cmd, filename;
    if (language === 'javascript') {
      image = 'node:18';
      cmd = ['tail', '-f', '/dev/null']; // Keep alive
      filename = 'script.js';
    } else if (language === 'python') {
      image = 'python:3.11';
      cmd = ['tail', '-f', '/dev/null'];
      filename = 'script.py';
    } else if (language === 'solidity') {
      image = 'ethereum/solc:stable';
      cmd = ['tail', '-f', '/dev/null'];
      filename = 'contract.sol';
    } else {
      return res.status(400).json({ error: 'Unsupported language' });
    }
    const container = await docker.createContainer({
      Image: image,
      Cmd: cmd,
      Tty: false,
      HostConfig: {
        NetworkMode: 'none',
        Memory: 128 * 1024 * 1024,
        CpuShares: 128,
      },
      WorkingDir: '/code',
    });
    await container.start();
    sessions[sessionId] = { container, language, filename };
    res.json({ sessionId });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create session' });
  }
});

// POST /api/execute - Execute code in a running session container
router.post('/', async (req, res) => {
  const { code, sessionId } = req.body;
  if (!code || !sessionId) {
    return res.status(400).json({ error: 'Missing code or sessionId' });
  }
  const session = sessions[sessionId];
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  try {
    // Use a new function to exec code in the running container
    const result = await executeCodeInDocker(code, session.language, session.container, session.filename);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Execution failed' });
  }
});

// POST /api/session/close - Close a session and stop/remove the container
router.post('/session/close', async (req, res) => {
  const { sessionId } = req.body;
  const session = sessions[sessionId];
  if (!session) return res.status(404).json({ error: 'Session not found' });
  try {
    await session.container.stop();
    await session.container.remove();
    delete sessions[sessionId];
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to close session' });
  }
});

export default router; 