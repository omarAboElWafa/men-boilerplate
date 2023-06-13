import { Express } from 'express';
import exampleModule from '../components/example/example.module';
import userModule from '../components/user/user.module';


export default (app : Express) => {
    app.use('/examples', exampleModule.router); 
    app.use('/users', userModule.router);
}