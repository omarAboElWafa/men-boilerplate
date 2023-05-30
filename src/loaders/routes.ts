import { Express } from 'express';
import exampleModule from '../components/example/example.module';


export default (app : Express) => {
    app.use('/examples', exampleModule.router);
}