import mongoose from "mongoose";
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: Boolean,
    default: false,
  },
  pages: {
    type: Number,
    default: false,
  },
});

const Book = mongoose.model("book", BookSchema);

export default Book;
