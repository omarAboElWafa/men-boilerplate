import mongoose, {Schema} from "mongoose";
import  validator   from "validator";
import { IUser } from "@/contracts/user";

const UserSchema :Schema = new Schema({
    firstName: {
        type: String, 
        required: [true, 'First name is required'],
        maxlength: [50, 'First name should not be more than 50 characters long'],
        validate: [/^[a-zA-Z]+$/, 'First name should contain only letters']
    },
    lastName:  {
        type : String, 
        required: [true, 'Last name is required'],
        maxlength: [50, 'Last name should not be more than 50 characters long'],
        validate: [/^[a-zA-Z]+$/, 'Last name should contain only letters']
    },
    email: {
        type: String, 
        required: [true, 'Email is required'], 
        unique: true, 
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Please enter a valid email']
    },
    username: {
        type: String, 
        required: [true, 'Username is required'], 
        unique: true
    },
    password: {
        type: String, 
        required: [true, 'Password is required'], 
        minlength: [8, 'Password should be at least 8 characters long']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true,
    },
    verified: {
        type: Boolean, default: false},
    },
    {timestamps: true}
);

export default mongoose.model<IUser>('User', UserSchema);