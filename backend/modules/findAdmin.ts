import Admin from "../models/admins";

export async function findAdmin(token: unknown) {
  if (typeof token !== "string" || token === "") {
    return null;
  }
  return Admin.findOne({ token });
}
