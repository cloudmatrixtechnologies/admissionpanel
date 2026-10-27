
import mongoose from "mongoose";
import dns from "node:dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri || !uri.trim()) {
    throw new Error("MONGODB_URI is missing from environment variables");
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    maxPoolSize: 10,
    minPoolSize: 0,
    maxIdleTimeMS: 30000,
  });

  console.log("MongoDB connected successfully");
}

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error.message);
});

export default connectDB;
