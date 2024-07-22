import express from 'express';
import apiRoute from './routes/ruta.js';
import send from './routes/send.routes.js';
import { getConnection } from '../database/config.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
getConnection();

app.use(express.json());
app.use("/api", apiRoute);
app.use('/api/send', send);

app.listen(PORT, () => {
    console.log("El puerto es: " + PORT);
});
