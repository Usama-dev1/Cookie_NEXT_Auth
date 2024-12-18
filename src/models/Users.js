import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please Provide a Username"],
    },
    email: {
      type: String,
      required: [true, "Please Provide a Email Address"],
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: String,
    verifyToken: String,
    verifyTokenExpiry: String,
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.model("users", userSchema) || mongoose.models.users;
export default Users;
