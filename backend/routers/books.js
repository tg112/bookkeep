import express from "express";

import {
  getAllBooks,
  getBookById,
  deleteBook,
  updateBook,
  addBook,
} from "../controllers/books.js";

const router = express.Router();

router.get("/books", getAllBooks);
router.get("/books/:bookId", getBookById);
router.post("/books", addBook);
router.put("/books/:bookId", updateBook);
router.delete("/books/:bookId", deleteBook);

export default router;
