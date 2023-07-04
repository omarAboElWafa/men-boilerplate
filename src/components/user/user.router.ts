import { Router } from "express";
import { checkPhone, checkEmail, verifyAccessToken, verifyRefreshToken } from "../../utils/middlewares";
import UserController from './user.controller';

class UserRouter{
    userController : UserController;
    constructor(UserController: UserController){
        this.userController = UserController;
    }
    getRouter = () => {
        const router = Router();
        router.post('/register', [checkPhone, checkEmail] ,this.userController.register);
        router.post('/login', checkEmail ,this.userController.login);
        router.get('/logout',[verifyAccessToken], this.userController.logout);
        router.get('/me', [verifyAccessToken] , this.userController.me);
        router.post('/refresh-token', [verifyRefreshToken], this.userController.refreshToken);
        router.post('/change-password',[verifyAccessToken], this.userController.changePassword);
        router.post('/forgot-password',[checkEmail, checkPhone], this.userController.forgotPassword);
        router.post('/reset-password', this.userController.resetPassword);
        router.post('/verify-email', checkEmail ,this.userController.verifyEmail);
        router.post('/verify-phone',[verifyAccessToken], this.userController.verifyPhone);
        router.post('/issue-otp',[checkEmail, checkPhone], this.userController.issueOTP);
        return router;
    }
}

export default UserRouter;