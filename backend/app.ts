import "dotenv/config";
import "./models/connection";
import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import booksRouter from "./routes/books";
import reservationsRouter from "./routes/reservations";
import adminsRouter from "./routes/admins";
import eventsRouter from "./routes/events";
import picksRouter from "./routes/picks";
import catalogRouter from "./routes/catalog";

const app = express();

// Hosts like Render sit behind a proxy: without this, every visitor would share the proxy's IP for rate limiting
app.set("trust proxy", 1);

app.use(cors({ origin: process.env.FRONTEND_URL || true }));
app.use(express.json());

function limiter(limit: number, windowMinutes: number) {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { result: false, error: "Too many requests, try again later" },
  });
}

app.post("/admins/signin", limiter(10, 15));
app.post("/reservations", limiter(10, 15));
app.get("/books/search", limiter(60, 1));

app.get("/", (req, res) => {
  res.json({ result: true, message: "Hurlevent API" });
});

app.use("/books", booksRouter);
app.use("/reservations", reservationsRouter);
app.use("/admins", adminsRouter);
app.use("/events", eventsRouter);
app.use("/picks", picksRouter);
app.use("/catalog", catalogRouter);

app.use((req, res) => {
  res.status(404).json({ result: false, error: "Route not found" });
});

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (error.type === "entity.parse.failed") {
    res.status(400).json({ result: false, error: "Invalid JSON" });
    return;
  }
  console.error(error);
  res.status(500).json({ result: false, error: "Server error" });
};
app.use(errorHandler);

const port = process.env.PORT ?? 4000;
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
