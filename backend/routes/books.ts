import { Router } from "express";

const router = Router();

router.get("/search", async (req, res) => {
  const query = req.query.q;
  if (typeof query !== "string" || query.trim() === "") {
    res.status(400).json({ result: false, error: "Missing search query" });
    return;
  }
  res.json({ result: true, query });
});

export default router;
