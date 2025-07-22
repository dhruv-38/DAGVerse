import express from 'express';
import {
  register, login, walletChallenge, walletVerify
} from '../controllers/authController.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/wallet-challenge', walletChallenge);
router.post('/wallet-verify', walletVerify);

export default router;

