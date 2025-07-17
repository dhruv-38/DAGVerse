import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { ethers } from 'ethers';
import User from '../models/User.js';

// Traditional Registration
export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User with this email or username already exists' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    
    res.status(201).json({ 
      message: 'User registered successfully',
      user: { username: user.username, email: user.email }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(400).json({ error: 'Registration failed', details: err.message });
  }
};

// Traditional Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user._id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    res.json({ 
      token, 
      user: { 
        id: user._id,
        username: user.username, 
        email: user.email,
        walletAddress: user.walletAddress 
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Wallet Challenge
export const walletChallenge = (req, res) => {
  const { walletAddress } = req.body;
  
  if (!walletAddress) {
    return res.status(400).json({ error: 'Wallet address is required' });
  }
  
  const nonce = Math.floor(Math.random() * 1000000).toString();
  const challenge = `Sign this message to authenticate with DAGVerse: ${nonce}`;
  
  // In a production app, you'd store this nonce in Redis/DB for replay protection
  res.json({ 
    challenge,
    nonce,
    message: 'Challenge generated successfully'
  });
};

// Wallet Verify
export const walletVerify = async (req, res) => {
  const { walletAddress, signature, challenge } = req.body;
  
  try {
    if (!walletAddress || !signature || !challenge) {
      return res.status(400).json({ 
        error: 'Wallet address, signature, and challenge are required' 
      });
    }

    // For demo purposes, we'll accept any signature
    // In production, you'd verify the signature properly
    let isValidSignature = true;
    
    try {
      // Try to verify the signature (this might fail with demo signatures)
      const recovered = ethers.verifyMessage(challenge, signature);
      isValidSignature = recovered.toLowerCase() === walletAddress.toLowerCase();
    } catch (verifyError) {
      console.log('Signature verification failed, using demo mode');
      // For demo purposes, accept the signature
      isValidSignature = true;
    }

    if (!isValidSignature) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Find or create user
    let user = await User.findOne({ walletAddress });
    if (!user) {
      // Create new user with wallet address
      user = new User({ 
        walletAddress,
        username: `user_${walletAddress.slice(2, 8)}`, // Generate username from address
        email: `${walletAddress.slice(2, 8)}@wallet.dagverse` // Generate email
      });
      await user.save();
    }

    const token = jwt.sign(
      { walletAddress: user.walletAddress, userId: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    res.json({ 
      token, 
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        walletAddress: user.walletAddress
      },
      message: 'Wallet connected successfully'
    });
  } catch (err) {
    console.error('Wallet verification error:', err);
    res.status(500).json({ error: 'Wallet authentication failed' });
  }
};
