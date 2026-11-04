// Mongo: import Admin from "../models/admins";
import prisma from "../models/prisma";

export async function findAdmin(token: unknown) {
  if (typeof token !== "string" || token === "") {
    return null;
  }
  // Mongo: return Admin.findOne({ token });
  return prisma.admin.findUnique({ where: { token } });
}
