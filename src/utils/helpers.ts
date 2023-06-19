import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export const usernameFromEmail = (email : string) => {
    if(!email.includes('@')) throw new Error('Invalid email');
    return email.split('@')[0];
}


export const comparePassword = async (password :string, hashedPassword :string) => {
    return await bcrypt.compare(password, hashedPassword);
}

export const generateAuthToken = async (user : {} & mongoose.AnyObject, secret :string, expiresIn :string) => {
    const token = jwt.sign({ _id : user._id }, secret, { expiresIn: expiresIn });
    return token;
}