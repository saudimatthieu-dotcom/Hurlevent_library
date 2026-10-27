import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    date: { type: String, required: true }, // "YYYY-MM-DD", kept as text so no timezone shifts the day
    time: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const Event = mongoose.model("events", eventSchema);

export default Event;
