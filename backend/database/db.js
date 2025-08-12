import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const URL = process.env.MONGODB_URL;
console.log('MongoDB URL:', URL);

const Connection = () => {
  if (!URL) {
    console.error('MongoDB connection string is missing!');
    return;
  }

  mongoose.connect(URL)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));
};

export default Connection;
