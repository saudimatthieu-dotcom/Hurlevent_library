import mongoose from "mongoose";

const catalogBookSchema = new mongoose.Schema(
  {
    isbn: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    coverUrl: String,
    category: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const CatalogBook = mongoose.model("catalogbooks", catalogBookSchema);

export default CatalogBook;
