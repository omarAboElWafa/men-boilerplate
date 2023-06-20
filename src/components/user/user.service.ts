import User from './user.entities'; 
import { IUser, NewUserInput } from '@/contracts/user';
import * as cache from "../../utils/cache";
import { REFRESH_TOKEN_EXPIRY_FOR_CACHE } from '../../utils/config';

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

    findUserById = async (id: string, fullUser:boolean = false) => {
        if(fullUser) return await User.findById(id).select({ password: 0 }).lean();
        return await User.findById(id).select({ password: 0, _id: 0 }).lean();
    }

    storeToken = async (id: string, token: string) => {
        const tokensCacheClient = cache.tokenClientPool;
        const stored =  await cache.setToCache(tokensCacheClient, id, token, REFRESH_TOKEN_EXPIRY_FOR_CACHE);
        
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