import express from 'express';
import routes from './loaders/routes';

const app = express();
app.use(express.json());
routes(app);

export default app;