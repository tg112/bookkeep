// put more comments throughout the code and tell us what's happening or about to happen here
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
router.patch("/books/:bookId", updateBook);
router.delete("/books/:bookId", deleteBook);

export default router;
