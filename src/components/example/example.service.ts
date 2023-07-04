import {Request, Response} from 'express';
import Example from "./example.entities";

class ExampleService {
    private exampleEntity : Example;
    constructor(exampleEntity : Example) {
        this.exampleEntity = exampleEntity;
    }
    // TODO: Add the return type of all functions.
    // TODO: Implement all functions to add to the database.
    addExample = (example : Example) => {
        // Add the example to the database.
    }
    getExamples = () => {
        // Get all examples from the database.
    }

    getExampleById = (id : number) => {
        // Get the example with the given id from the database.
    }
}

export default ExampleService;