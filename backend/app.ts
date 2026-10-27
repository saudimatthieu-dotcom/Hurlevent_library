import "dotenv/config";
import "./models/connection";
import express from "express";
import cors from "cors";
import booksRouter from "./routes/books";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ result: true, message: "Hurlevent API" });
});

app.use("/books", booksRouter);

const port = process.env.PORT ?? 4000;
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
