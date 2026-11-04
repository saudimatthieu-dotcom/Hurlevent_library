import { Router } from "express";
// Mongo: import Pick from "../models/picks";
import prisma from "../models/prisma";
// Mongo: import { requireAdmin, requireValidId } from "../modules/requireAdmin";
import { requireAdmin, requireIntId } from "../modules/requireAdmin";
import { isFilled, optionalText } from "../modules/validation";

const router = Router();

router.get("/", async (req, res) => {
  // Mongo: const picks = await Pick.find().sort({ createdAt: -1 });
  const picks = await prisma.pick.findMany({ orderBy: { createdAt: "desc" } });
  res.json({ result: true, picks });
});

router.post("/", requireAdmin, async (req, res) => {
  const { isbn, title, author, coverUrl, note } = req.body;
  if (!isFilled(isbn) || !isFilled(title) || !isFilled(author)) {
    res.status(400).json({ result: false, error: "Missing or empty fields" });
    return;
  }

  // Mongo: if (await Pick.findOne({ isbn })) {
  // findUnique works on isbn because it is @unique in the schema (on other fields, use findFirst)
  if (await prisma.pick.findUnique({ where: { isbn } })) {
    res.status(409).json({ result: false, error: "Book already in picks" });
    return;
  }

  // Mongo: const pick = await new Pick({ isbn, title, author, coverUrl: optionalText(coverUrl), note: optionalText(note) }).save();
  // undefined = leave the column empty, so Postgres stores NULL and the API sends "coverUrl": null
  const pick = await prisma.pick.create({
    data: { isbn, title, author, coverUrl: optionalText(coverUrl), note: optionalText(note) },
  });
  res.json({ result: true, pick });
});

// Mongo: router.put("/:id", requireValidId, requireAdmin, async (req, res) => {
router.put("/:id", requireIntId, requireAdmin, async (req, res) => {
  // Mongo: const pick = await Pick.findByIdAndUpdate(req.params.id, { note: optionalText(req.body.note) ?? "" }, { new: true });
  // Mongo: if (!pick) { ...404 }
  const id = Number(req.params.id);
  const existing = await prisma.pick.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ result: false, error: "Pick not found" });
    return;
  }

  // In an update, undefined means "don't touch this column", so an emptied note must be sent as null to be cleared
  const pick = await prisma.pick.update({ where: { id }, data: { note: optionalText(req.body.note) ?? null } });
  res.json({ result: true, pick });
});

// Mongo: router.delete("/:id", requireValidId, requireAdmin, async (req, res) => {
router.delete("/:id", requireIntId, requireAdmin, async (req, res) => {
  // Mongo: const pick = await Pick.findByIdAndDelete(req.params.id);
  // Mongo: if (!pick) { ...404 }
  const id = Number(req.params.id);
  const existing = await prisma.pick.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ result: false, error: "Pick not found" });
    return;
  }

  await prisma.pick.delete({ where: { id } });
  res.json({ result: true });
});

export default router;
