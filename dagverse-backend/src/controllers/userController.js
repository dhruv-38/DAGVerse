import User from '../models/User.js';

// Get user profile
export const getProfile = async (req, res) => {
  try {
    let user;
    
    // Handle both traditional login and wallet login
    if (req.user.userId) {
      user = await User.findById(req.user.userId);
    } else if (req.user.walletAddress) {
      user = await User.findOne({ walletAddress: req.user.walletAddress });
    }
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Return user data without sensitive information
    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      walletAddress: user.walletAddress,
      createdAt: user.createdAt
    };
    
    res.json(userData);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    let user;
    
    // Handle both traditional login and wallet login
    if (req.user.userId) {
      user = await User.findById(req.user.userId);
    } else if (req.user.walletAddress) {
      user = await User.findOne({ walletAddress: req.user.walletAddress });
    }
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update fields if provided
    if (username) user.username = username;
    if (email) user.email = email;
    
    await user.save();
    
    // Return updated user data
    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      walletAddress: user.walletAddress,
      createdAt: user.createdAt
    };
    
    res.json(userData);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
}; 