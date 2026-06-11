import express from "express";
import { connectDB } from "./db.js";
import booksRouter from "./routers/books.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("frontend"));
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
