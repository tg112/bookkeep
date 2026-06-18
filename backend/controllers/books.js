import { ObjectId } from "mongodb";
import { getBooksCollection } from "../models/Book.js";
import { getNotesCollection } from "../models/Note.js";

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
    const { status, genre, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (genre) query.genre = genre;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const collection = getBooksCollection();
    const [books, total] = await Promise.all([
      collection.find(query).skip(skip).limit(limitNum).toArray(),
      collection.countDocuments(query),
    ]);

    return res.status(200).json({
      books,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

export const addBook = async (req, res) => {
  try {
    const doc = { currentPage: 0, status: "UNREAD", ...req.body };
    const result = await getBooksCollection().insertOne(doc);
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
    await getNotesCollection().deleteMany({
      bookId: new ObjectId(req.params.bookId),
    });
    return res.status(200).send();
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};
