import express, {Express} from 'express';
import mongoose, {ConnectOptions} from 'mongoose';
import routes from './loaders/routes';
import {PORT, MONGO_URI} from './utils/config';


async function startServer() : Promise<void> {
    const app : Express = express();
    const ConnectOptions : ConnectOptions  = {
        retryWrites: true,
        w: "majority",
    };

    // Midlewares
    app.use(express.json());

    // Load routes
    routes(app);

    // Connect to DB
    await mongoose.connect(MONGO_URI,  ConnectOptions);

    // Start server
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
    
}


startServer().catch((error) => {
    console.error('Failed to start the server:', error);
  });

