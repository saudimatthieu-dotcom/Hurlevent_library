import { Router } from "express";
import Reservation from "../models/reservations";

const router = Router();

function isFilled(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

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

export default router;
