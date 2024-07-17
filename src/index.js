// index.js
const express = require("express");
const apiruta = require("./routes/ruta"); // Importa las rutas configuradas
import send from './routes/send.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", apiruta); // Monta las rutas bajo /api
app.use('/api/send', send);

app.listen(PORT, () => {
    console.log("El puerto es: " + PORT);
});
