import "dotenv/config";
import bcrypt from "bcrypt";
import uid2 from "uid2";
import prisma from "../models/prisma";

async function changePassword() {
  const [email, password] = process.argv.slice(2);

  if (!email || !password || password.length < 10) {
    console.log("Usage: npx tsx scripts/changePassword.ts EMAIL NEW_PASSWORD (10 characters minimum)");
    return;
  }

  const cleanEmail = email.toLowerCase().trim();
  const existing = await prisma.admin.findUnique({ where: { email: cleanEmail } });

  if (!existing) {
    console.log("No admin with this email");
  } else {
    // A new token signs out every browser that was logged in with the old password
    await prisma.admin.update({
      where: { email: cleanEmail },
      data: { password: bcrypt.hashSync(password, 10), token: uid2(32) },
    });
    console.log(`Password changed for ${cleanEmail}`);
  }

  await prisma.$disconnect();
}

changePassword();
