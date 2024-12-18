import mongoose from "mongoose";
const connectDb = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("database is already connected");
      return mongoose.connection
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    return conn;
  } catch (error) {
    console.error("database connection failed", error);
    throw error
  }
};
export default connectDb