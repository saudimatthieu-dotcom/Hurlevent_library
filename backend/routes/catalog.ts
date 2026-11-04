import { Router } from "express";
// Mongo: import CatalogBook from "../models/catalogBooks";
import prisma from "../models/prisma";
// Mongo: import { requireAdmin, requireValidId } from "../modules/requireAdmin";
import { requireAdmin, requireIntId } from "../modules/requireAdmin";
import { isFilled, optionalText } from "../modules/validation";

const router = Router();

router.get("/", async (req, res) => {
  // Mongo: const books = await CatalogBook.find().sort({ category: 1, title: 1 });
  // An array, not an object: the order matters (category first, then title within each category)
  const books = await prisma.catalogBook.findMany({ orderBy: [{ category: "asc" }, { title: "asc" }] });
  res.json({ result: true, books });
});

router.post("/", requireAdmin, async (req, res) => {
  const { isbn, title, author, coverUrl, category } = req.body;
  if (![isbn, title, author, category].every(isFilled)) {
    res.status(400).json({ result: false, error: "Missing or empty fields" });
    return;
  }

  // Mongo: if (await CatalogBook.findOne({ isbn })) {
  if (await prisma.catalogBook.findUnique({ where: { isbn } })) {
    res.status(409).json({ result: false, error: "Book already in catalog" });
    return;
  }

  // Mongo: const book = await new CatalogBook({ isbn, title, author, coverUrl: optionalText(coverUrl), category }).save();
  // category.trim(): the Mongoose schema had trim: true, Prisma has no equivalent
  const book = await prisma.catalogBook.create({
    data: { isbn, title, author, coverUrl: optionalText(coverUrl), category: category.trim() },
  });
  res.json({ result: true, book });
});

// Mongo: router.delete("/:id", requireValidId, requireAdmin, async (req, res) => {
router.delete("/:id", requireIntId, requireAdmin, async (req, res) => {
  // Mongo: const book = await CatalogBook.findByIdAndDelete(req.params.id);
  // Mongo: if (!book) { ...404 }
  const id = Number(req.params.id);
  const existing = await prisma.catalogBook.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ result: false, error: "Book not found" });
    return;
  }

  await prisma.catalogBook.delete({ where: { id } });
  res.json({ result: true });
});

export default router;
