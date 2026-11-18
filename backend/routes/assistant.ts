import { Router } from "express";
import { z } from "zod";
import { askAssistant } from "../modules/assistant";

const router = Router();

// The message length limit: checked before anything is sent to the model
const bodySchema = z.object({
  message: z.string().trim().min(1).max(500),
  // The chatbox needs memory to connect previous answers with new question
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(2000),
      })
    )
    .max(10)
    .default([]),
});

router.post("/", async (req, res) => {
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    // Either the message (1 to 500 characters) or the history (10 turns of 2000 characters max) is invalid
    res.status(400).json({ result: false, error: "Invalid message or history" });
    return;
  }

  try {
    const answer = await askAssistant(parsed.data.message, parsed.data.history);
    res.json({ result: true, answer });
  } catch (error) {
    console.error(error);
    res.status(502).json({ result: false, error: "Assistant unavailable" });
  }
});

export default router;