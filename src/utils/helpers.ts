import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { JWT_SECRET } from './config';

export const usernameFromEmail = (email : string) => {
    if(!email.includes('@')) throw new Error('Invalid email');
    return email.split('@')[0];
}


export const comparePassword = async (password :string, hashedPassword :string) => {
    return await bcrypt.compare(password, hashedPassword);
}

export const generateAuthToken = async (user : {} & mongoose.AnyObject) => {
    const token = jwt.sign({ _id : user.id }, JWT_SECRET, { expiresIn: '1d' });
    return token;
}