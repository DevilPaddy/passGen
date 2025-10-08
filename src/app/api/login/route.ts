import {connect} from '../../../../lib/db';
import User from '../../../../models/user';
import bcrypt from 'bcryptjs';
import  jwt  from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server'

connect()

export async function POST(req: NextRequest){
    try{
        const body = await req.json();
        const {email, password} = body;

        // try user is present or not...
        const isUser = await User.findOne({email});

        if(!isUser){
            return NextResponse.json({error:"❌ user not found"},
                {status:400})
        };

        const hashedPass = isUser.password;
        const isValidPass = await bcrypt.compare(password,hashedPass);

        if(!isValidPass){
            return NextResponse.json({error:"❌ Wrong password!!!"},
                {status:400})
        };

        const jwtToken = jwt.sign({
            userId: isUser._id, email: isUser.email},
            process.env.JWT_SECRET!,
            {expiresIn: '30d'}
        );

        const res = NextResponse.json({success:true, message: "Logged successful"})
        res.cookies.set('authToken', jwtToken,{
            maxAge: 60 * 60 * 24 * 30,
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production'
        });

        return res
    }
    catch(error:any){
        return NextResponse.json({error:error.message},{status:500})
    }
}