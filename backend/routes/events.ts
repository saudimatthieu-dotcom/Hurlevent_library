import { Router } from "express";
// Mongo: import Event from "../models/events";
import prisma from "../models/prisma";
// Mongo: import { requireAdmin, requireValidId } from "../modules/requireAdmin";
import { requireAdmin, requireIntId } from "../modules/requireAdmin";
import { isFilled, isIsoDate } from "../modules/validation";

const router = Router();

function readEvent(body: Record<string, unknown>) {
  const { title, date, time, description } = body;
  if (!isFilled(title) || !isIsoDate(date) || !isFilled(time) || !isFilled(description)) {
    return null;
  }
  // Mongo: return { title, date, time, description };   (the schema's trim: true did the trimming)
  return { title: title.trim(), date, time: time.trim(), description: description.trim() };
}

router.get("/", async (req, res) => {
  // Mongo: const events = await Event.find().sort({ date: 1 });
  const events = await prisma.event.findMany({ orderBy: { date: "asc" } });
  res.json({ result: true, events });
});

router.post("/", requireAdmin, async (req, res) => {
  const fields = readEvent(req.body);
  if (!fields) {
    res.status(400).json({ result: false, error: "Missing or invalid fields" });
    return;
  }

  // Mongo: const event = await new Event(fields).save();
  const event = await prisma.event.create({ data: fields });
  res.json({ result: true, event });
});

// Mongo: router.put("/:id", requireValidId, requireAdmin, async (req, res) => {
router.put("/:id", requireIntId, requireAdmin, async (req, res) => {
  const fields = readEvent(req.body);
  if (!fields) {
    res.status(400).json({ result: false, error: "Missing or invalid fields" });
    return;
  }

  // Mongo: const event = await Event.findByIdAndUpdate(req.params.id, fields, { new: true, runValidators: true });
  // Mongo: if (!event) { ...404 }   (findByIdAndUpdate returns null when the id doesn't exist)
  const id = Number(req.params.id);
  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ result: false, error: "Event not found" });
    return;
  }

  // Prisma's update throws instead of returning null, hence the findUnique check above
  const event = await prisma.event.update({ where: { id }, data: fields });
  res.json({ result: true, event });
});

// Mongo: router.delete("/:id", requireValidId, requireAdmin, async (req, res) => {
router.delete("/:id", requireIntId, requireAdmin, async (req, res) => {
  // Mongo: const event = await Event.findByIdAndDelete(req.params.id);
  // Mongo: if (!event) { ...404 }
  const id = Number(req.params.id);
  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ result: false, error: "Event not found" });
    return;
  }

  // Same as update: delete throws when the id doesn't exist
  await prisma.event.delete({ where: { id } });
  res.json({ result: true });
});

export default router;
