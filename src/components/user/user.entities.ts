import mongoose, {Schema} from "mongoose";
import  validator   from "validator";
import { IUser } from "@/contracts/user";
import { comparePassword, generateAuthToken} from "../../utils/helpers";
import { hashPassword } from "../../utils/hooks";

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
    gender: {
        type: String,
        enum: ['male', 'female'],
        default : 'male'
    },
    birthDate: {
        type: Date,
        default: null
    },

    isAdmin: {
        type: Boolean, default: false
    },
    loginCount :{
        type: Number,
        default: 0
    },
    verified: {
        type: Boolean, default: false
    },
   
    qualified: {
        type: Boolean, default: false
    },
    },   
    {timestamps: true}
);


//hash password before saving to database
UserSchema.pre<IUser>('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        try {
            user.password = await hashPassword(user.password);
        } catch (error) {
            console.error('Error hashing password');
        }
    }
    next();
});


//compare password
UserSchema.methods.comparePassword = comparePassword;


export default mongoose.model<IUser>('User', UserSchema);