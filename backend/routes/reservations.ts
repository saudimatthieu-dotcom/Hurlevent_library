import { Router } from "express";
// Mongo: import Reservation from "../models/reservations";
import prisma from "../models/prisma";
import { ReservationStatus } from "../generated/prisma/client";
// Mongo: import { requireAdmin, requireValidId } from "../modules/requireAdmin";
import { requireAdmin, requireIntId } from "../modules/requireAdmin";
import { isFilled, optionalText } from "../modules/validation";

const router = Router();

// Mongo: const STATUSES = ["pending", "ready", "collected", "cancelled"];
// The list now comes from the enum in schema.prisma, so it can't drift from the database
const STATUSES: string[] = Object.values(ReservationStatus);

function isStatus(value: unknown): value is ReservationStatus {
  return typeof value === "string" && STATUSES.includes(value);
}

router.post("/", async (req, res) => {
  const { isbn, title, author, customerName, phone, email } = req.body;

  const requiredFields = [isbn, title, author, customerName, phone];
  if (!requiredFields.every(isFilled)) {
    res.status(400).json({ result: false, error: "Missing or empty fields" });
    return;
  }

  // Mongo: const newReservation = new Reservation({ isbn, title, author, customerName, phone, email: optionalText(email) });
  // Mongo: const savedReservation = await newReservation.save();
  // status is left out: Postgres applies the default 'pending'
  const savedReservation = await prisma.reservation.create({
    data: { isbn, title, author, customerName, phone, email: optionalText(email) },
  });

  res.json({ result: true, reservation: savedReservation });
});

router.get("/:token", requireAdmin, async (req, res) => {
  // Mongo: const reservations = await Reservation.find().sort({ createdAt: -1 });
  const reservations = await prisma.reservation.findMany({ orderBy: { createdAt: "desc" } });
  res.json({ result: true, reservations });
});

// Mongo: router.put("/:id/status", requireValidId, requireAdmin, async (req, res) => {
router.put("/:id/status", requireIntId, requireAdmin, async (req, res) => {
  const { status } = req.body;

  // Mongo: if (!STATUSES.includes(status)) {
  // isStatus also tells TypeScript that status is a ReservationStatus, which Prisma requires below
  if (!isStatus(status)) {
    res.status(400).json({ result: false, error: "Invalid status" });
    return;
  }

  // Mongo: const reservation = await Reservation.findByIdAndUpdate(req.params.id, { status }, { new: true });
  // Mongo: if (!reservation) { ...404 }
  const id = Number(req.params.id);
  const existing = await prisma.reservation.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ result: false, error: "Reservation not found" });
    return;
  }

  const reservation = await prisma.reservation.update({ where: { id }, data: { status } });
  res.json({ result: true, reservation });
});

export default router;
