const mongoose = require("mongoose");

const connectDB = async (uri) => {
  if (!uri) {
    throw new Error("MongoDB connection string (MONGODB_URI) is required");
  }

  try {
    await mongoose.connect(uri);
    console.log("✓ MongoDB Connected");
  } catch (error) {
    console.error(`✗ MongoDB Connection Failed: ${error.message}`);
    throw error;
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  console.log("✓ MongoDB Disconnected");
};

module.exports = { connectDB, disconnectDB };
