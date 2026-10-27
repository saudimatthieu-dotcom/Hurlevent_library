import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    isbn: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    status: {
      type: String,
      enum: ["pending", "ready", "collected", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Reservation = mongoose.model("reservations", reservationSchema);

export default Reservation;
