import { connect } from '../../../../lib/db';
import User from '../../../../models/user';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { verifyEmailTemplate } from '../../../../email/templets/verificationEmail'; 
import { sendEmail } from '../../../../email/sendEmail';
import { cookies } from 'next/headers';

connect();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const { username, email, password } = body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "🫤 User already exists!" },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 min

    newUser.otp = otp;
    newUser.otpExpiry = otpExpiry;
    await newUser.save();

    // Send email
    const emailContent = verifyEmailTemplate(username, otp);
    await sendEmail({
      to: newUser.email,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    // ✅ Set cookie with email (expires in 10 mins)
    const res = NextResponse.json({ success: true, message: "Signup successful" })
    res.cookies.set('verifyEmail', email, {
      httpOnly: true,
      path: '/',
      maxAge: 600, // 10 minutes
      secure: process.env.NODE_ENV === 'production',
    })

    return res
  } catch (error: any) {
    console.error("Signup error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}