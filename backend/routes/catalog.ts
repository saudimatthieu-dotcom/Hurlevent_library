import { Router } from "express";
import CatalogBook from "../models/catalogBooks";
import { requireAdmin, requireValidId } from "../modules/requireAdmin";
import { isFilled, optionalText } from "../modules/validation";

const router = Router();

router.get("/", async (req, res) => {
  const books = await CatalogBook.find().sort({ category: 1, title: 1 });
  res.json({ result: true, books });
});

router.post("/", requireAdmin, async (req, res) => {
  const { isbn, title, author, coverUrl, category } = req.body;
  if (![isbn, title, author, category].every(isFilled)) {
    res.status(400).json({ result: false, error: "Missing or empty fields" });
    return;
  }

  if (await CatalogBook.findOne({ isbn })) {
    res.status(409).json({ result: false, error: "Book already in catalog" });
    return;
  }

  const book = await new CatalogBook({ isbn, title, author, coverUrl: optionalText(coverUrl), category }).save();
  res.json({ result: true, book });
});

router.delete("/:id", requireValidId, requireAdmin, async (req, res) => {
  const book = await CatalogBook.findByIdAndDelete(req.params.id);
  if (!book) {
    res.status(404).json({ result: false, error: "Book not found" });
    return;
  }
  res.json({ result: true });
});

export default router;
