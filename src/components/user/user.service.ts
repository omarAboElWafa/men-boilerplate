import User from './user.entities'; 
import { IUser, NewUserInput } from '@/contracts/user';
import { handleValidationError } from '@/utils/loggers';

class UserService {
    addUser = async (user: NewUserInput<IUser>) => {
        try{
            const newUSer = new User(user);
            return await newUSer.save();
        } catch(error){
            throw error;
        }
    }
}

export default UserService;