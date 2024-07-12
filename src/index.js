const express = require("express");
const apiruta =require("./routes/ruta")

const app = express();

const PORT = process.env.port || 3000;

app.use(express.json());

app.use("/api",apiruta);

app.listen(PORT,()=>{
    console.log("El puerto es :" + PORT);
})