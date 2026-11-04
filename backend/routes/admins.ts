import { Router } from "express";
import bcrypt from "bcrypt";
// Mongo: import Admin from "../models/admins";
import prisma from "../models/prisma";

const router = Router();

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (typeof email !== "string" || typeof password !== "string" || email.trim() === "" || password === "") {
    res.status(400).json({ result: false, error: "Missing or empty fields" });
    return;
  }

  // Mongo: const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
  const admin = await prisma.admin.findUnique({ where: { email: email.toLowerCase().trim() } });

  if (!admin || !bcrypt.compareSync(password, admin.password)) {
    res.status(401).json({ result: false, error: "Wrong email or password" });
    return;
  }

  res.json({ result: true, token: admin.token });
});

export default router;
