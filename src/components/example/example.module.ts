import ExampleController from "./example.controller";
import ExampleService from "./example.service";
import ExampleRouter from "./example.router";
import Example from "./example.entities";

const exampleEntity = new Example('saa', 1, true);
const exampleService = new ExampleService(exampleEntity);
const exampleController = new ExampleController(exampleService);
const exampleRouter = new ExampleRouter(exampleController);

export default {
    service: exampleService,
    controller: exampleController,
    router: exampleRouter.getRouter()
};