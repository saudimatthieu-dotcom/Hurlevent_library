import type { RequestHandler } from "express";
import mongoose from "mongoose";
import { findAdmin } from "./findAdmin";

export const requireAdmin: RequestHandler = async (req, res, next) => {
  const admin = await findAdmin(req.params.token ?? req.body?.token);
  if (!admin) {
    res.status(401).json({ result: false, error: "Not authorized" });
    return;
  }
  next();
};

export const requireValidId: RequestHandler = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).json({ result: false, error: "Invalid id" });
    return;
  }
  next();
};

// Postgres ids are whole numbers (1, 2, 3…), not Mongo ObjectIds
export const requireIntId: RequestHandler = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ result: false, error: "Invalid id" });
    return;
  }
  next();
};
