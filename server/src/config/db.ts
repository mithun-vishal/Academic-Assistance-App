import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // read MONGO_URI from .env

// Function to connect to MongoDB
export const connectDB = async ()  => {

  try {
    await mongoose.connect(process.env.MONGO_URI as string),{
    serverSelectionTimeoutMS: 5000
    };
    console.log(' Connected to MongoDB');
  }
   catch (err)
   {
    console.error(' MongoDB connection error:', err);
    process.exit(1); // Stop the server if DB fails
  }
};
