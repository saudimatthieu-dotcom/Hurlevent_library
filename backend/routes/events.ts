import { Router } from "express";
import Event from "../models/events";
import { requireAdmin, requireValidId } from "../modules/requireAdmin";
import { isFilled, isIsoDate } from "../modules/validation";

const router = Router();

function readEvent(body: Record<string, unknown>) {
  const { title, date, time, description } = body;
  if (!isFilled(title) || !isIsoDate(date) || !isFilled(time) || !isFilled(description)) {
    return null;
  }
  return { title, date, time, description };
}

router.get("/", async (req, res) => {
  const events = await Event.find().sort({ date: 1 });
  res.json({ result: true, events });
});

router.post("/", requireAdmin, async (req, res) => {
  const fields = readEvent(req.body);
  if (!fields) {
    res.status(400).json({ result: false, error: "Missing or invalid fields" });
    return;
  }

  const event = await new Event(fields).save();
  res.json({ result: true, event });
});

router.put("/:id", requireValidId, requireAdmin, async (req, res) => {
  const fields = readEvent(req.body);
  if (!fields) {
    res.status(400).json({ result: false, error: "Missing or invalid fields" });
    return;
  }

  const event = await Event.findByIdAndUpdate(req.params.id, fields, { new: true, runValidators: true });
  if (!event) {
    res.status(404).json({ result: false, error: "Event not found" });
    return;
  }
  res.json({ result: true, event });
});

router.delete("/:id", requireValidId, requireAdmin, async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) {
    res.status(404).json({ result: false, error: "Event not found" });
    return;
  }
  res.json({ result: true });
});

export default router;
