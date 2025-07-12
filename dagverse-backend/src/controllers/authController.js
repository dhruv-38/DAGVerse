import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { ethers } from 'ethers';
import User from '../models/User.js';

// Traditional Registration
export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(400).json({ error: 'Registration failed', details: err.message });
  }
};

// Traditional Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};

// Wallet Challenge
export const walletChallenge = (req, res) => {
  const { walletAddress } = req.body;
  const nonce = Math.floor(Math.random() * 1000000).toString();
  const challenge = `Sign this message to authenticate: ${nonce}`;
  // Optionally: Store nonce in Redis/DB for replay protection
  res.json({ challenge });
};

// Wallet Verify
export const walletVerify = async (req, res) => {
  const { walletAddress, signature, challenge } = req.body;
  try {
    const recovered = ethers.utils.verifyMessage(challenge, signature);
    if (recovered.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
    let user = await User.findOne({ walletAddress });
    if (!user) {
      user = new User({ walletAddress });
      await user.save();
    }
    const token = jwt.sign({ walletAddress }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: 'Wallet authentication failed' });
  }
};
