import mongoose from "mongoose";

const MONGO_URI = "mongodb+srv://18patel70:Tarun9875@cluster0.3ax6icx.mongodb.net";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected (movies database)");
  } catch (error) {
    console.error("❌ MongoDB connection failed", error);
    process.exit(1);
  }
};
