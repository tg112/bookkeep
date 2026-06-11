import express from "express";
import bookRouter from "./routers/books.js";

const app = express();
const PORT = 3000;

app.use(express.static("client"));
app.use("/api", bookRouter);

app.listen(PORT, () => {
  console.log("listening 3000...");
});
