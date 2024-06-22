//Traemos express y su router
const express = require("express");
const router = express.Router();
const Book = require("../models/book.model");

//MIDDLEWARE

const getBook = async (req, res, next) => {
  let book;
  //OBTENGO EL DATO DE TODOS LOS PARAMETROS DE LA SOLICITUD, DESESTRUCTURANDOLO
  const { id } = req.params;

  //CONSULTANDO SI EL ID ES VALIDO (EN FORMATO MONGO)
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      message: "El ID del libro no es válido",
    });
  }

  try {
    //INTENTA ENCONTRAR EL LIBRO
    book = await Book.findById(id);

    //SI NO ENCUENTRA EL LIBRO, TIRA EL MENSAJE Y ERROR 404
    if (!book) {
      return res.status(404).json({
        message: "El libro no fue encontrado",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }

  // SI LO ENCONTRO
  res.book = book;
  next();
};

//OBTENER TODOS LOS LIBROS [GET ALL]
router.get("/", async (req, res) => {
  try {
    //buscar y traer todos los libros
    const books = await Book.find();

    //mostrar los libros que encontramos
    console.log("GET ALL", books);

    //si no hay libros, mostramos lista vacia
    if (books.length === 0) {
      return res.status(204).json([]);
    }
    res.json(books);
  } catch (error) {
    res.status(500).json({ mesagge: error.mesagge });
  }
});

//Publicar o crear un nuevo libro

// Crear un nuevo libro (recurso) [POST]
router.post("/", async (req, res) => {
  //Traigo los datos necesarios del req.body
  const { title, author, genre, publication_date } = req?.body;

  //Valido que no falte ninguno
  if (!title || !author || !genre || !publication_date) {
    return res.status(400).json({
      message: "Los campos título, autor, género y fecha son obligatorios",
    });
  }

  //Creo una instancia de libro y le asigno los datos traidos del req.body
  const book = new Book({
    title,
    author,
    genre,
    publication_date,
  });

  //TRY: Guardo la instancia del libro (de manera asincrona) con book.save()
  // CATCH: Tiro msge de error
  try {
    const newBook = await book.save();
    console.log(newBook);
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

//GET X ID
router.get("/:id", getBook, async (req, res) => {
  const book = getBook(req.params.id);
  res.json(res.book);
});

// PUT

router.put("/:id", getBook, async (req, res) => {
  try {
    const book = res.book;
    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.genre = req.body.genre || book.genre;
    book.publication_date = req.body.publication_date || book.publication_date;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
});

router.patch("/:id", getBook, async (req, res) => {
  if (
    !req.body.tittle &&
    !req.body.author &&
    !req.body.genre &&
    !req.body.publication_date
  ) {
    res.status(404).json({
      message:
        "Alguno de los campos debe ser proporcionado (Titulo, Genero, Autor, Fecha de publicación)",
    });
  }

  try {
    const book = res.book;
    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.genre = req.body.genre || book.genre;
    book.publication_date = req.body.publication_date || book.publication_date;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
});

//DELETE

router.delete("/:id", getBook, async (req, res) => {
  try {
    const book = res.book;
    await Book.findByIdAndDelete(book.id);
    res.json({
      mesage: `El libro ${book.title} se ha eliminado correctamente`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
