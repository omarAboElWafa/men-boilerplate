import { Request, Response } from "express";
import UserService from "./user.service";
import * as helpers from "../../utils/helpers";
import { handleValidationError } from "../../utils/loggers";
import { IUser, UserInput } from "@/contracts/user";
import { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY_FOR_CACHE, OTP_TOKEN_EXPIRY_FOR_CACHE, ACCESS_TOKEN_EXPIRY_FOR_CACHE, RESET_PASSWORD_TOKEN_EXPIRY_FOR_CACHE } from "../../utils/config";

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
            const qualified = false;
            const user : UserInput<IUser> = { firstName, lastName, email, username, password, verified, phone, qualified};
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
            const refreshStored = this.userService.storeToken(user._id, refreshToken, REFRESH_TOKEN_EXPIRY_FOR_CACHE);
            const accessStored = this.userService.storeToken(`access-${user._id}`, accessToken, ACCESS_TOKEN_EXPIRY_FOR_CACHE);
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
            const accessStored = this.userService.storeToken(`access-${user._id}`, newAccessToken, REFRESH_TOKEN_EXPIRY_FOR_CACHE);
            if(!accessStored){
                return res.status(500).send({message: "Something went wrong"});
            }
            return res.status(200).send({accessToken: newAccessToken});
        }
        catch(error){
            console.log(error);
            return res.status(400).send(handleValidationError(error));
        }
        
    }

    forgotPassword = async (req: Request, res: Response) => {
        try{
            const { email } = req.body;
            const user = await this.userService.findUserByEmail(email);
            if(!user){
                return res.status(404).send({message: "Invalid user"});
            }
            const token = await helpers.generateResetPasswordToken(user);
            // const storedToken = await this.userService.storeToken(`reset-${user._id}`, token, RESET_PASSWORD_TOKEN_EXPIRY_FOR_CACHE);
            // if(!storedToken){
            //     return res.status(500).send({message: "Something went wrong"});
            // }
            const resetPasswordLink = `${process.env.BASE_URL}/users/reset-password?token=${token}`;
            const messageText = `<p>Click <a href="${resetPasswordLink}">here</a> to reset your password</p>`;
            const sent = await helpers.sendGenericEmail(email, "Reset Password", messageText);
            if(!sent){
                return res.status(500).send({message: "Something went wrong"});
            }
            return res.status(200).send({message: "Reset password link sent to your email"});
        }
        catch(error){
            console.log(error);
            return res.status(400).send(handleValidationError(error));
        }
    }

    resetPassword = async (req: Request, res: Response) => {
        try{
            const { token }= req.query;
            const id = await helpers.decodeResetPasswordToken(token as string);
            const user = await this.userService.findUserById(id);
            if(!user){
                return res.status(404).send({message: "Invalid user"});
            }
            // const isValidToken = await this.userService.findToken(`reset-password-${user._id}`);
            // if(!isValidToken || isValidToken !== token){
            //     return res.status(401).send({message: "Invalid token"});
            // }
            const accessToken = await helpers.generateAuthToken(user, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY);
            const accessStored = this.userService.storeToken(`access-${user._id}`, accessToken, ACCESS_TOKEN_EXPIRY_FOR_CACHE);
            if(!accessStored){
                return res.status(500).send({message: "Something went wrong"});
            }
            return res.status(200).send({'accessToken' : accessToken});   
        }
        catch(error){
            console.log(error);
            return res.status(400).send(handleValidationError(error));
        }
    }

    changePassword = async (req: Request, res: Response) => {
        try{
            const { userID, oldPassword, newPassword } = req.body;
            const user = await this.userService.findUserById(userID, true);
            if(!user){
                return res.status(404).send({message: "Invalid user"});
            }
            const isMatch = await helpers.comparePassword(oldPassword, user.password);
            if(!isMatch){
                return res.status(401).send({message: "Wrong password"});
            }
            const userInput : Object = {password: newPassword};
            const updatedUser = await this.userService.updateUser(userID, userInput);
            if(!updatedUser){
                return res.status(500).send({message: "Something went wrong"});
            }
            return res.status(200).send({message: "Password updated successfully"});
            
        }
        catch(error){
            console.log(error);
            return res.status(400).send(handleValidationError(error));
        }
    }

    verifyEmail = async (req: Request, res: Response) => {
        try{
            const {email, otp, userID} = req.body;
            const user = await this.userService.findUserByEmail(email);
            if(!user){
                return res.status(404).send({message: "User not found"});
            }

            // if(user._id !== userID){
            //     return res.status(401).send({message: "Unauthorized user"});
            // }

            if(user.verified){
                return res.status(200).send({message: "Email already verified"});
            }

            const retrievedOtp = await this.userService.findToken(`email-otp-${user._id}`);
            if(!retrievedOtp){
                return res.status(401).send({message: "No OTP generated"});
            }

            if(retrievedOtp !== otp){
                return res.status(401).send({message: "Invalid OTP"});
            }

            const verifyEmail = await this.userService.updateUser(user._id, {verified: true});
            if(!verifyEmail){
                return res.status(500).send({message: "Something went wrong"});
            }

            return res.status(200).send({message: "Email verified successfully"});
        }
        catch(error){
            console.log(error);
            return res.status(400).send(handleValidationError(error));
        }
    }

    verifyPhone = async (req: Request, res: Response) => {
        try {
            const { phone, otp, userID } = req.body;
            const user = await this.userService.findUserByUniqueAttribute('phone', phone, true);
            if(!user){
                return res.status(404).send({message: "User not found"});
            }
            if(user._id.toString() !== userID){
                return res.status(401).send({message: "Unauthorized user"});
            }

            if(user.qualified){
                return res.status(200).send({message: "Phone already verified"});
            }

            const retrievedOtp = await this.userService.findToken(`phone-otp-${user._id}`);
            if(!retrievedOtp){
                return res.status(401).send({message: "No OTP generated or OTP expired"});
            }

            if(retrievedOtp !== otp){
                return res.status(401).send({message: "Invalid OTP"});
            }

            const verifyPhone = await this.userService.updateUser(user._id, {qualified: true});
            if(!verifyPhone){
                return res.status(500).send({message: "Something went wrong"});
            }

            return res.status(200).send({message: "Phone verified successfully"});
        } catch (error) {
            console.log(error);
            return res.status(400).send(handleValidationError(error));
        }
    }

    issueOTP = async (req: Request, res: Response) => {
        try {
            const { phone, email }  = req.body;
            if(!phone && !email){
                return res.status(400).send({message: 'Invalid verification method.'});
            }
            if(phone && email){
                return res.status(400).send({message: 'Only one verification method is allowed.'});
            }
            const via = phone ? 'phone' : 'email';

            const otp = helpers.generateOTP();
            if(!otp){
                return res.status(500).send({message: "Something went wrong"});
            }

            if(email){
                const user = await this.userService.findUserByUniqueAttribute('email', email, true);
                if(!user){
                    return res.status(404).send({ message : 'No user found' });                
                }
                const emailSent = await helpers.sendVerificationEmail(user.email, otp);
                if(!emailSent){
                    return res.status(500).send({message: "Something went wrong"});
                }
                const otpStored =  this.userService.storeToken(`email-otp-${user._id}`, otp, OTP_TOKEN_EXPIRY_FOR_CACHE);
                if(!otpStored){
                    return res.status(500).send({message: "Something went wrong"});
                }
            }

            if(phone){
                const user = await this.userService.findUserByUniqueAttribute('phone', phone, true);
                if(!user){
                    return res.status(404).send({ message : 'No user found' });
                }
                const mobileSent = await helpers.sendToMobile(phone, otp);
                if(!mobileSent){
                    return res.status(500).send({message: "Something went wrong"});
                }
                const otpStored =  this.userService.storeToken(`phone-otp-${user._id}`, otp, OTP_TOKEN_EXPIRY_FOR_CACHE);
                if(!otpStored){
                    return res.status(500).send({message: "Something went wrong"});
                }
            }
            return res.status(200).send({message: `Sent successfully, please check your ${via}`});

        } catch (error) {
            console.log(error);
            res.status(400).send(handleValidationError(error));
        }
    }
}

export default UserController;