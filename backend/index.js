import express from "express";
import cors from "cors";

import { connectDB } from "./db.js";
import booksRouter from "./routers/books.js";
import notesRouter from "./routers/notes.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/api", booksRouter);
app.use("/api", notesRouter);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("listening 3000...");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });
