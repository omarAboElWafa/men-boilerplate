import { Request, Response } from "express";
import UserService from "./user.service";
import * as helpers from "../../utils/helpers";
import { handleValidationError } from "../../utils/loggers";
import { IUser, NewUserInput } from "@/contracts/user";
import { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY } from "../../utils/config";

class UserController {
    userService : UserService;
    constructor(UserService: UserService){
        this.userService = UserService;
    }

    register = async (req: Request, res: Response) => {
        try{
            const {firstName, lastName, email, password, phone} =req.body;
            const username = helpers.usernameFromEmail(email);
            const verified = false;
            const user : NewUserInput<IUser> = {firstName, lastName, email, username, password, verified, phone};
            return res.status(201).send(await this.userService.addUser(user));
        }
        catch(error){
            console.log(error);
            return res.status(400).send(handleValidationError(error));
        }
    }
    login = async (req: Request, res: Response) => {
        try{
            const {email, password} = req.body;
            const user = await this.userService.findUserByEmail(email);
            if(!user){
                //TODO: change the error message
                return res.status(401).send({message: "No user found with this email"});
            }
            const isMatch = await helpers.comparePassword(password, user.password);
            if(!isMatch){
                return res.status(401).send({message: "Wrong password"});
            }
            const accessToken = await helpers.generateAuthToken(user, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY);
            const refreshToken = await helpers.generateAuthToken(user, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY);
            
            // Check if the user's refresh token is blacklisted
            const isBlacklisted = await this.userService.isRefreshTokenBlacklisted(user._id);
            const whiteListed = isBlacklisted? await this.userService.whitelistRefreshToken(user._id) : true;

            if(!whiteListed){
                return res.status(500).send({message: "Something went wrong"});
            }
            
            // Store the refresh token in redis
            const refreshStored = this.userService.storeToken(user._id, refreshToken);
            const accessStored = this.userService.storeToken(`access-${user._id}`, accessToken);
            if(!refreshStored || !accessStored){
                return res.status(500).send({message: "Something went wrong"});
            }
            return res.status(200).send({accessToken, refreshToken});
        }
        catch(error){
            console.log(error);
            return res.status(400).send(handleValidationError(error));
        }
    }

    logout = async (req: Request, res: Response) => {
        try{
            const {userID} = req.body;
            if(!userID || userID === ""){
                return res.status(401).send({message: "Unauthorized User"});
            }
            // check if the refresh token is blacklisted
            const isBlacklisted = await this.userService.isRefreshTokenBlacklisted(userID);
            if(isBlacklisted){
                return res.status(403).send({message: "Blacklisted user token"});
            }
            // blacklist the user session and store that on redis
            const blacklisted = await this.userService.blacklistRefreshToken(userID);
            const revocateAccessToken = await this.userService.deleteToken(`access-${userID}`); 

            if(!blacklisted || !revocateAccessToken){
                return res.status(500).send({message: "Something went wrong"});
            }
            return res.status(200).send({message: "Logout successful"});
        }
        catch(error){
            console.log(error);
            return res.status(400).send(handleValidationError(error));
        }
    }
    me = async (req: Request, res: Response) => {
        try{
            const user = await this.userService.findUserById(req.body.userID);
            if(!user){
                return res.status(404).send({message: "User not found"});
            }
            return res.status(200).send(user);
        }
        catch(error){
            console.log(error);
            return res.status(400).send(handleValidationError(error));
        }
    }
    refreshToken = async (req: Request, res: Response) => {

        try{
            const {clientRefreshToken} = req.body;
            if(!clientRefreshToken){
                return res.status(401).send({message: "Invalid refresh token"});
            }

            // verify refresh token in redis
            const storedToken = await this.userService.findToken(req.body.userID);
            if(storedToken !== clientRefreshToken){
                return res.status(401).send({message: "Invalid refresh token"});
            }

            // check if the refresh token is blacklisted
            const isBlacklisted = await this.userService.isRefreshTokenBlacklisted(req.body.userID);
            if(isBlacklisted){
                return res.status(403).send({message: "Blacklisted refresh token"});
            }

            // generate new access token
            const user = await this.userService.findUserById(req.body.userID, true);
            if(!user){
                return res.status(404).send({message: "User not found"});
            }
            const newAccessToken = await helpers.generateAuthToken(user, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY);
            return res.status(200).send({accessToken: newAccessToken});
        }
        catch(error){
            console.log(error);
            return res.status(400).send(handleValidationError(error));
        }
        
    }
    forgotPassword = async (req: Request, res: Response) => {}
    resetPassword = async (req: Request, res: Response) => {}
    verifyEmail = async (req: Request, res: Response) => {}
    verifyPhone = async (req: Request, res: Response) => {}

}

export default UserController;