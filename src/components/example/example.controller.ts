//the controller which receives incoming requests from the router and prepares necessary parameters to call the appropriate service functions.
import {Request, Response} from "express";  // Import the Request and Response interfaces from express.
import Example from "./example.entities";  // Import the entity of your component.
import ExampleService from "./example.service";  // Import the service of your component.

class ExampleController {
    exampleService : ExampleService;  // Inject the service of your component.
    constructor(exampleService : ExampleService) {
        this.exampleService = exampleService;
    }

    // Define the methods of your component's controller.
    createExample = (req : Request, res : Response) :Response => {
        try{
            const {prop1, prop2, prop3} = req.body;
            const example : Example = new Example(prop1, prop2, prop3);
            return res.status(201).send(this.exampleService.addExample(example));
        }
        catch(error){
            return res.status(400).send(error.message);
        }
    }

    getExamples = ( _ : Request, res : Response) => {
        return res.status(200).send(this.exampleService.getExamples());
    }  

    getExampleById = (req : Request, res : Response) => {
        const id  = parseInt(req.params.id);
        return res.status(200).send(this.exampleService.getExampleById(id));
    }
}


export default ExampleController;