import express from 'express';
import apiRoute from './routes/ruta.js';
import chat from './routes/chat.routes.js';
import auth from './routes/auth.routes.js';
import { getConnection } from './database/config.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
getConnection();

app.use(cors());
app.use(express.json());
app.use("/api", apiRoute);
app.use('/api/chat', chat);
app.use('/api/auth', auth)

app.listen(PORT, () => {
    console.log("El puerto es: " + PORT);
});
