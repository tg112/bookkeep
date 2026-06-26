// put more comments throughout the code and tell us what's happening or about to happen here
import express from "express";

import {
  getNotesByBook,
  addNote,
  updateNote,
  deleteNote,
} from "../controllers/notes.js";

const router = express.Router();

router.get("/books/:bookId/notes", getNotesByBook);
router.post("/books/:bookId/notes", addNote);
router.patch("/notes/:noteId", updateNote);
router.delete("/notes/:noteId", deleteNote);

export default router;
