import User from './user.entities'; 
import { IUser, NewUserInput } from '@/contracts/user';

class UserService {
    addUser = async (user: NewUserInput<IUser>) => {
        try{
            const newUSer = new User(user);
            return await newUSer.save();
        } catch(error){
            throw error;
        }
    }
    findUserByEmail = async (email: string) => {
        return await User.findOne({email}).lean();
    }

    findUserById = async (id: string) => {
        return await User.findById(id).select('-password').lean();
    }

}

export default UserService;