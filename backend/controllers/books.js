import { ObjectId } from "mongodb";
import { getBooksCollection } from "../models/Book.js";

export const getBookById = async (req, res) => {
  try {
    const book = await getBooksCollection().findOne({
      _id: new ObjectId(req.params.bookId),
    });
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    return res.status(200).json(book);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

export const getAllBooks = async (req, res) => {
  try {
    const books = await getBooksCollection().find().toArray();
    return res.status(200).json(books);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

export const addBook = async (req, res) => {
  try {
    const result = await getBooksCollection().insertOne(req.body);
    const book = await getBooksCollection().findOne({ _id: result.insertedId });
    return res.status(201).json(book);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const book = await getBooksCollection().findOneAndUpdate(
      { _id: new ObjectId(req.params.bookId) },
      { $set: req.body },
      { returnDocument: "after" },
    );
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    return res.status(200).json(book);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const result = await getBooksCollection().deleteOne({
      _id: new ObjectId(req.params.bookId),
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
    return res.status(200).send();
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};
