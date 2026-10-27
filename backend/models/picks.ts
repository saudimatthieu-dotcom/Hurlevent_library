import mongoose from "mongoose";

const pickSchema = new mongoose.Schema(
  {
    isbn: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    coverUrl: String,
    note: { type: String, trim: true },
  },
  { timestamps: true }
);

const Pick = mongoose.model("picks", pickSchema);

export default Pick;
