import { NextResponse } from "next/server";
import Users from "@/models/Users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDb from "@/util/connectDb";
export const POST = async (request) => {
  connectDb()
  const data = await request.json();
  console.log(data);
  const { password, email } = data;
  //check all form fields
  if (!password || !email) {
    return NextResponse.json(
      { error: "Enter all the form fields" },
      { status: 400 }
    );
  }
 
  const checkUser = await Users.findOne({ email });
  if (!checkUser) {
    return NextResponse.json(
      { error: "Try different Email Address" },
      { status: 400 }
    );
  }
  const isPasswordValid = await bcrypt.compare(password, checkUser.password);
  if (!isPasswordValid) {
    return NextResponse.json({ error: "Wrong password" }, { status: 400 });
  }
   const tokenData = {
     id: checkUser._id,
     username: checkUser.username,
     email: checkUser.email,
     isAdmin:checkUser.isAdmin
   };

    const token = jwt.sign(tokenData, process.env.JWT_KEY, {
      expiresIn: "2h",
    });
    const response = NextResponse.json(
      { message: "User Logged in successfully" },
      { status: 201 }
    );
    response.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 2 * 60 * 60,
    });
    return response;
  }

