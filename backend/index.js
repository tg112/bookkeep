import express from "express";
import cors from "cors";

import { connectDB } from "./db.js";
import booksRouter from "./routers/books.js";

const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: ["http://localhost:3000", "https://tg112.github.io"],
  }),
);
app.use(express.json());
app.use("/api", booksRouter);

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
