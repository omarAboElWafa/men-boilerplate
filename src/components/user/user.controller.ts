import { Request, Response } from "express";
import UserService from "./user.service";
import * as helpers from "../../utils/helpers";
import { handleValidationError } from "../../utils/loggers";
import { IUser, NewUserInput } from "@/contracts/user";

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
    login = async (req: Request, res: Response) => {}
    logout = async (req: Request, res: Response) => {}
    me = async (req: Request, res: Response) => {}
    refreshToken = async (req: Request, res: Response) => {}
    forgotPassword = async (req: Request, res: Response) => {}

}

export default UserController;