import * as express from "express";
import ExampleController from './example.controller';

class ExampleRouter{ 
    exampleController : ExampleController;
    constructor(ExampleController: ExampleController){
        this.exampleController = ExampleController;
    }
    getRouter = () => {
        const router = express.Router();
        router.get('/', this.exampleController.getExamples);
        router.post('/', this.exampleController.createExample);
        router.get('/:id', this.exampleController.getExampleById);
        return router;
    }
}

export default ExampleRouter;