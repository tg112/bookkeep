import Book from "../models/Book.js";

export const getBookById = async (req, res) => {
  const bookId = req.params.bookId;
  const book = await Book.findById(bookId);

  try {
    if (!book) {
      return res.status(400).json({ error: "book not found" });
    }
    req.book = book;
  } catch (e) {
    return res.status(400).send(e);
  }
};

export const getAllBooks = async (req, res) => {
  const books = await Book.find();
  try {
    if (!books) {
      return res.status(400).send("There is no books");
    }
    return res.status(200).send(books);
  } catch (e) {
    return res.status(400).send(e);
  }
};

export const addBook = async (req, res) => {
  const book = await new Book({ ...req.body });
  try {
    if (!book) {
      return res.status(400).send("Failed to save data");
    }
    await book.save();
    return res.status(201).send(book);
  } catch (e) {
    return res.status(400).send(e);
  }
};

export const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      { _id: req.params.bookId },
      { $set: req.body },
      { new: true },
    );
    if (!book) {
      return res.status(400).send({ error: "Update was failed" });
    }
    res.send(book);
  } catch (e) {
    res.status(400).send(e);
  }
};

export const deleteBook = async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.bookId);
  try {
    if (!book) {
      return res.status(404).send("User not found");
    }
    return res.status(200).send();
  } catch (e) {
    return res.status(400).send(e);
  }
};
