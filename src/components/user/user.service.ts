import User from './user.entities'; 
import { IUser, UserInput } from '@/contracts/user';
import * as cache from "../../utils/cache";
import { REFRESH_TOKEN_EXPIRY_FOR_CACHE } from '../../utils/config';
import { Console } from 'console';

class UserService {
    addUser = async (user: UserInput<IUser>) => {
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

    findUserById = async (id: string, fullUser:boolean = false) => {
        if(fullUser) return await User.findById(id).lean();
        return await User.findById(id).select({ password: 0, _id: 0 }).lean();
    }

    findUserByUniqueAttribute = async (attribute: string, value: string, fullUser:boolean = false) => {
        const validAttributes = ['email', 'phone'];
        if(!validAttributes.includes(attribute)) throw new Error('Invalid attribute');
        const query = {[attribute]: value};
        if(fullUser){return await User.findOne(query).select({password: 0}).lean();}
        return await User.findOne(query).select({password: 0, _id: 0}).lean();
    }

    updateUser = async (id: string, toBeUpdated : Object) => {
        const updated = await User.findByIdAndUpdate(id, {$set: toBeUpdated}, {new: true });
        const updatedUser = new User(updated);
        return await updatedUser.save();
    }

    storeToken = async (id: string, token: string, expiresIn : number) => {
        const tokensCacheClient = cache.tokenClientPool;
        const stored =  await cache.setToCache(tokensCacheClient, id, token, expiresIn);
        
        return stored;
    }

    findToken = async (id: string) => {
        const tokensCacheClient = cache.tokenClientPool;
        const token =  await cache.getFromCache(tokensCacheClient, id);
        
        return token;
    }

    isRefreshTokenBlacklisted = async (id: string) => {
        const tokensCacheClient = cache.tokenClientPool;
        const blacklistedUser = await cache.getFromCache(tokensCacheClient, `${id}-blacklisted`);
        
        return !!blacklistedUser;
    }

    whitelistRefreshToken = async (id: string) => {
        const tokensCacheClient = cache.tokenClientPool;
        const whiteListed =  await cache.deleteFromCache(tokensCacheClient, `${id}-blacklisted`);
        
        return whiteListed;
    }

    blacklistRefreshToken = async (id: string) => {
        const tokensCacheClient = cache.tokenClientPool;
        const blacklisted =  await cache.setToCache(tokensCacheClient, `${id}-blacklisted`, 'true', REFRESH_TOKEN_EXPIRY_FOR_CACHE);
        
        return blacklisted;
    }

    deleteToken = async (id: string) => {
        const tokensCacheClient = cache.tokenClientPool;
        const deleted = await cache.deleteFromCache(tokensCacheClient, id);
        
        return deleted;
    }

}

export default UserService;