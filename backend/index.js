import express from "express";
import bookRouter from "./routers/books.js";
import mongoose from "mongoose";

const app = express();
const PORT = 3000;

// TODO: We need to decide how to handle this.
mongoose.connect("mongodb://localhost:27017/bookkeep");

app.use(express.json());
app.use(express.static("client"));
app.use("/api", bookRouter);

app.listen(PORT, () => {
  console.log("listening 3000...");
});
