import User from './user.entities'; 
import { IUser, NewUserInput } from '@/contracts/user';
import { handleValidationError } from '../../utils/loggers';

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
}

export default UserService;