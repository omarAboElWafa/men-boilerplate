import { Router } from "express";
import { checkPhone } from "../../utils/middlewares";
import UserController from './user.controller';

class UserRouter{
    userController : UserController;
    constructor(UserController: UserController){
        this.userController = UserController;
    }
    getRouter = () => {
        const router = Router();
        router.post('/register', checkPhone ,this.userController.register);
        router.post('/login', this.userController.login);
        router.get('/logout', this.userController.logout);
        router.get('/me', this.userController.me);
        router.post('/refresh-token', this.userController.refreshToken);
        router.post('/forgot-password', this.userController.forgotPassword);
        router.post('/reset-password', this.userController.resetPassword);
        router.post('/verify-email', this.userController.verifyEmail);
        router.post('/verify-phone', this.userController.verifyPhone);
        return router;
    }
}

export default UserRouter;