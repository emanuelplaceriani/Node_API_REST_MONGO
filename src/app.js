const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { config } = require("dotenv");
config();

const bookRoutes = require("./routes/book.routes");

//USAMOS EXPRESS PARA LOS MIDDLEWARES
const app = express();
//PARSEADOR DE BODYS
app.use(bodyParser.json());

//CONECTAREMOS LA BASE DE DATOS
mongoose.connect(process.env.MONGO_URL, {
  dbName: process.env.MONGO_DB_NAME,
});
const db = mongoose.connection;

app.use("/books", bookRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`servidor iniciado en el puerto ${port}`);
});
