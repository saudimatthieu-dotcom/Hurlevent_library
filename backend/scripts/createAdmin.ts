import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import uid2 from "uid2";
import Admin from "../models/admins";

async function createAdmin() {
  const [email, password] = process.argv.slice(2);

  if (!email || !password || password.length < 10) {
    console.log("Usage: npx tsx scripts/createAdmin.ts EMAIL PASSWORD (10 characters minimum)");
    return;
  }

  await mongoose.connect(process.env.CONNECTION_STRING ?? "");

  const existing = await Admin.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log("An admin with this email already exists");
  } else {
    await new Admin({ email, password: bcrypt.hashSync(password, 10), token: uid2(32) }).save();
    console.log(`Admin created: ${email}`);
  }

  await mongoose.disconnect();
}

createAdmin();
