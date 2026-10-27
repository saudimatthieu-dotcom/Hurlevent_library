import { Router } from "express";
import mongoose from "mongoose";
import Reservation from "../models/reservations";
import { findAdmin } from "../modules/findAdmin";

const router = Router();

function isFilled(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

const STATUSES = ["pending", "ready", "collected", "cancelled"];

router.post("/", async (req, res) => {
  const { isbn, title, author, customerName, phone, email } = req.body;

  const requiredFields = [isbn, title, author, customerName, phone];
  if (!requiredFields.every(isFilled)) {
    res.status(400).json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const newReservation = new Reservation({ isbn, title, author, customerName, phone, email });
  const savedReservation = await newReservation.save();

  res.json({ result: true, reservation: savedReservation });
});

router.get("/:token", async (req, res) => {
  const admin = await findAdmin(req.params.token);
  if (!admin) {
    res.status(401).json({ result: false, error: "Not authorized" });
    return;
  }

  const reservations = await Reservation.find().sort({ createdAt: -1 });
  res.json({ result: true, reservations });
});

router.put("/:id/status", async (req, res) => {
  const { token, status } = req.body;

  const admin = await findAdmin(token);
  if (!admin) {
    res.status(401).json({ result: false, error: "Not authorized" });
    return;
  }

  if (!STATUSES.includes(status)) {
    res.status(400).json({ result: false, error: "Invalid status" });
    return;
  }

  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).json({ result: false, error: "Invalid reservation id" });
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
