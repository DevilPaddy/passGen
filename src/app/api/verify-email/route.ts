import { connect } from '../../../../lib/db';
import User from '../../../../models/user';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../../../../email/sendEmail';
import { welcomeEmailTemplate } from '../../../../email/templets/welcomeEmail';

connect();

export async function POST(req: NextRequest) {
  try {
    const { otp }:{otp:string} = await req.json();

    // 🍪 Get email from cookie
    const cookieStore = await cookies(); // ❌ No need for `await` here
    const email = cookieStore.get('verifyEmail')?.value;

    if (!email) {
      return NextResponse.json({ error: '❌ Email not found in cookie' }, { status: 400 });
    }
    console.log(email)
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: '❌ User not found' }, { status: 404 });
    }

    // 🧾 Check if OTP is expired or invalid
    if (!user.otp || !user.otpExpiry || new Date() > user.otpExpiry) {
      return NextResponse.json({ error: '❌ OTP expired or invalid' }, { status: 400 });
    }

    // ✅ Match OTP
    if (user.otp !== otp) {
      return NextResponse.json({ error: '❌ Incorrect OTP' }, { status: 400 });
    }

    // ✅ Update user
    user.verified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // ✅ Create response
    const response = NextResponse.json({ success: true, message: '✅ Email verified successfully' });

    // ❌ Delete temporary cookie
    response.cookies.set('verifyEmail', '', {
      maxAge: 0,
      path: '/',
    });

    // ✅ Create JWT token
    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' }
    );

    // ✅ Set session cookie
    response.cookies.set('authToken', jwtToken, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
    });

    // ✅ send welcome email...
    const emailContent = welcomeEmailTemplate(user.username);
    await sendEmail({
      to: user.email,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    return response;
  } catch (error: any) {
    console.error('OTP verification error:', error);
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}