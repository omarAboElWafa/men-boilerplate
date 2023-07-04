import UserController from "./user.controller";
import UserService from "./user.service";
import UserRouter from "./user.router";


const userService = new UserService();
const userController = new UserController(userService);
const userRouter = new UserRouter(userController);

export default {
    service: userService,
    controller: userController,
    router: userRouter.getRouter()
};