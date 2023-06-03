import mongoose, {Schema ,Document} from "mongoose";

export interface IUser extends Document{
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
}

const UserSchema :Schema = new Schema({
    firstName: {type: String, required: [true, 'First name is required']},
    lastName:  {type : String, required: [true, 'Last name is required']},
    email: {type: String, required: [true, 'Email is required'], unique: true},
    username: {type: String, required: [true, 'Username is required'], unique: true},
    password: {type: String, required: [true, 'Password is required']}
});

export default mongoose.model<IUser>('User', UserSchema);