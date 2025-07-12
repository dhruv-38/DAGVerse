import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, sparse: true },
  email: { type: String, unique: true, sparse: true },
  password: String, // hashed
  walletAddress: { type: String, unique: true, sparse: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);
