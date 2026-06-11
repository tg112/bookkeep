import express from "express";

const app = express();
const PORT = 3000;

app.use(express.static("frontend"));

app.listen(PORT, () => {
  console.log("listening 3000...");
});
