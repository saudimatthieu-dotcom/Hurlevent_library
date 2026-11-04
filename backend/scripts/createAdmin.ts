import "dotenv/config";
// Mongo: import mongoose from "mongoose";
import bcrypt from "bcrypt";
import uid2 from "uid2";
// Mongo: import Admin from "../models/admins";
import prisma from "../models/prisma";

async function createAdmin() {
  const [email, password] = process.argv.slice(2);

  if (!email || !password || password.length < 10) {
    console.log("Usage: npx tsx scripts/createAdmin.ts EMAIL PASSWORD (10 characters minimum)");
    return;
  }

  // Mongo: await mongoose.connect(process.env.CONNECTION_STRING ?? "");
  // Prisma connects by itself on the first query

  // Mongoose lowercased and trimmed the email (lowercase: true, trim: true), Prisma doesn't
  const cleanEmail = email.toLowerCase().trim();

  // Mongo: const existing = await Admin.findOne({ email: email.toLowerCase() });
  const existing = await prisma.admin.findUnique({ where: { email: cleanEmail } });
  if (existing) {
    console.log("An admin with this email already exists");
  } else {
    // Mongo: await new Admin({ email, password: bcrypt.hashSync(password, 10), token: uid2(32) }).save();
    await prisma.admin.create({ data: { email: cleanEmail, password: bcrypt.hashSync(password, 10), token: uid2(32) } });
    console.log(`Admin created: ${cleanEmail}`);
  }

  // Mongo: await mongoose.disconnect();
  await prisma.$disconnect();
}

createAdmin();
