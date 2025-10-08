import mongoose, { model, Schema, models } from "mongoose";

export const userSchema = new Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
    verified: {
        type: Boolean
    },
    forgetPasswordToken: {
        type: String,
    },
    forgetPasswordTokenExpiry:{
        type: Date,
    },
},{timestamps: true})

const User = models.User || model("User", userSchema)

export default User;