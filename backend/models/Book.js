import mongoose from "mongoose";
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
  },
  pages: {
    type: Number,
  },
});

const Book = mongoose.model("book", BookSchema);

export default Book;
