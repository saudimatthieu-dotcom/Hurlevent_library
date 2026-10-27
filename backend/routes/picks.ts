import { Router } from "express";
import Pick from "../models/picks";
import { requireAdmin, requireValidId } from "../modules/requireAdmin";
import { isFilled, optionalText } from "../modules/validation";

const router = Router();

router.get("/", async (req, res) => {
  const picks = await Pick.find().sort({ createdAt: -1 });
  res.json({ result: true, picks });
});

router.post("/", requireAdmin, async (req, res) => {
  const { isbn, title, author, coverUrl, note } = req.body;
  if (!isFilled(isbn) || !isFilled(title) || !isFilled(author)) {
    res.status(400).json({ result: false, error: "Missing or empty fields" });
    return;
  }

  if (await Pick.findOne({ isbn })) {
    res.status(409).json({ result: false, error: "Book already in picks" });
    return;
  }

  const pick = await new Pick({ isbn, title, author, coverUrl: optionalText(coverUrl), note: optionalText(note) }).save();
  res.json({ result: true, pick });
});

router.put("/:id", requireValidId, requireAdmin, async (req, res) => {
  const pick = await Pick.findByIdAndUpdate(req.params.id, { note: optionalText(req.body.note) ?? "" }, { new: true });
  if (!pick) {
    res.status(404).json({ result: false, error: "Pick not found" });
    return;
  }
  res.json({ result: true, pick });
});

router.delete("/:id", requireValidId, requireAdmin, async (req, res) => {
  const pick = await Pick.findByIdAndDelete(req.params.id);
  if (!pick) {
    res.status(404).json({ result: false, error: "Pick not found" });
    return;
  }
  res.json({ result: true });
});

export default router;
