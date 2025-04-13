import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/outfloai";

export const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    
    // Add connection options for better stability
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s
    });

    console.log("MongoDB connected successfully");
    
    // Log when the connection is lost
    mongoose.connection.on('disconnected', () => {
      console.log('Lost MongoDB connection');
    });
    
    // Log when the connection is reconnected
    mongoose.connection.on('reconnected', () => {
      console.log('Reconnected to MongoDB');
    });

  } catch (error) {
    console.error("MongoDB connection error:", error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    process.exit(1);
  }
};
