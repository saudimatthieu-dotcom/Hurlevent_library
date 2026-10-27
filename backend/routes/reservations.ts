import { Router } from "express";
import Reservation from "../models/reservations";
import { requireAdmin, requireValidId } from "../modules/requireAdmin";
import { isFilled, optionalText } from "../modules/validation";

const router = Router();

const STATUSES = ["pending", "ready", "collected", "cancelled"];

router.post("/", async (req, res) => {
  const { isbn, title, author, customerName, phone, email } = req.body;

  const requiredFields = [isbn, title, author, customerName, phone];
  if (!requiredFields.every(isFilled)) {
    res.status(400).json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const newReservation = new Reservation({ isbn, title, author, customerName, phone, email: optionalText(email) });
  const savedReservation = await newReservation.save();

  res.json({ result: true, reservation: savedReservation });
});

router.get("/:token", requireAdmin, async (req, res) => {
  const reservations = await Reservation.find().sort({ createdAt: -1 });
  res.json({ result: true, reservations });
});

router.put("/:id/status", requireValidId, requireAdmin, async (req, res) => {
  const { status } = req.body;

  if (!STATUSES.includes(status)) {
    res.status(400).json({ result: false, error: "Invalid status" });
    return;
  }

  const reservation = await Reservation.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!reservation) {
    res.status(404).json({ result: false, error: "Reservation not found" });
    return;
  }

  res.json({ result: true, reservation });
});

export default router;
