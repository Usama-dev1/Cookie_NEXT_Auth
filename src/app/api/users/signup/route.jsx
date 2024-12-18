import { NextResponse } from "next/server";
import Users from "@/models/Users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDb from "@/util/connectDb";
export const POST = async (request) => {
  connectDb();
  const data = await request.json();
  console.log(data);
  const { username, password, email } = data;
  //check all form fields
  if (!username || !password || !email) {
    return NextResponse.json(
      { error: "Enter all the form fields" },
      { status: 400 }
    );
  }
  //check for password length less than 6
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Enter all the form not a valid password" },
      { status: 400 }
    );
  }
  const checkUser = await Users.findOne({ email });
  if (checkUser) {
    return NextResponse.json(
      { error: "Try different Email Address" },
      { status: 400 }
    );
  }
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  const user = new Users({ username, email, password: hashPassword });
  try {
    await user.save();
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: checkUser.isAdmin,
    };
    const token = await jwt.sign(tokenData, process.env.JWT_KEY, {
      expiresIn: "2h",
    });
    const response = NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
    response.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 2 * 60 * 60,
    });
    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
