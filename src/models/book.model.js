//traigo Mongoose a una variable para poder usarlo
const mongoose = require("mongoose");

//Creo un Schema para modelar los datos de los libros en una estructura especifica
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  publication_date: String,
});

//Exporto el Modulo "book" con su esquema
module.exports = mongoose.model("Book", bookSchema);
