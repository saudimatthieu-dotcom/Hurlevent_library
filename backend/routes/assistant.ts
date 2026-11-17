import { Router } from "express";
import { z } from "zod";
import { askAssistant } from "../modules/assistant";

const router = Router();

// The message length limit: checked before anything is sent to the model
const bodySchema = z.object({
    message: z.string().trim().min(1).max(500),
});

router.post("/", async (req, res) => {
    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ result: false, error: "Message must be 1 to 500 characters" });
        return;
    }

    try {
        const answer = await askAssistant(parsed.data.message);
        res.json({ result: true, answer });
    } catch (error) {
        console.error(error);
        res.status(502).json({ result: false, error: "Assistant unavailable" });
    }
});


export default router;