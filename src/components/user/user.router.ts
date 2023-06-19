import { Router } from "express";
import { checkPhone, verifyAccessToken, verifyRefreshToken } from "../../utils/middlewares";
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
        router.get('/logout',[verifyAccessToken], this.userController.logout);
        router.get('/me', [verifyAccessToken] , this.userController.me);
        router.post('/refresh-token', [verifyRefreshToken], this.userController.refreshToken);
        router.post('/forgot-password',[verifyAccessToken], this.userController.forgotPassword);
        router.post('/reset-password',[verifyAccessToken], this.userController.resetPassword);
        router.post('/verify-email', this.userController.verifyEmail);
        router.post('/verify-phone',[verifyAccessToken], this.userController.verifyPhone);
        return router;
    }
}

export default UserRouter;