import "dotenv/config";
import mongoose from "mongoose";
import prisma from "../models/prisma";

// One-off copy of every MongoDB collection into PostgreSQL. Mongo is the source: the Postgres tables are
// emptied first, so the script can be run again (for example against the hosted database when deploying).
// Usage: npx tsx scripts/copyFromMongo.ts --yes

// The raw Mongo documents, read without the old Mongoose models
type MongoDoc = Record<string, any>;

async function readCollection(name: string): Promise<MongoDoc[]> {
  // Sorted by creation date so the new numeric ids follow the original order
  return mongoose.connection.db!.collection(name).find().sort({ createdAt: 1 }).toArray();
}

function timestamps(doc: MongoDoc) {
  return { createdAt: doc.createdAt ?? new Date(), updatedAt: doc.updatedAt ?? doc.createdAt ?? new Date() };
}

async function copyFromMongo() {
  if (!process.argv.includes("--yes")) {
    console.log("This empties the Postgres tables and copies MongoDB into them.");
    console.log("Run it again with --yes to confirm: npx tsx scripts/copyFromMongo.ts --yes");
    return;
  }

  await mongoose.connect(process.env.CONNECTION_STRING ?? "");

  const events = await readCollection("events");
  const picks = await readCollection("picks");
  const catalog = await readCollection("catalogbooks");
  const reservations = await readCollection("reservations");
  const admins = await readCollection("admins");

  // A transaction: if any insert fails, nothing is changed in Postgres
  await prisma.$transaction([
    // RESTART IDENTITY resets the ids, so the copied rows start again at 1
    prisma.$executeRaw`TRUNCATE "Event", "Pick", "CatalogBook", "Reservation", "Admin" RESTART IDENTITY`,
    prisma.event.createMany({
      data: events.map((doc) => ({
        title: doc.title,
        date: doc.date,
        time: doc.time,
        description: doc.description,
        ...timestamps(doc),
      })),
    }),
    prisma.pick.createMany({
      data: picks.map((doc) => ({
        isbn: doc.isbn,
        title: doc.title,
        author: doc.author,
        coverUrl: doc.coverUrl || null,
        note: doc.note || null, // Mongo stored "" for an emptied note, Postgres uses NULL
        ...timestamps(doc),
      })),
    }),
    prisma.catalogBook.createMany({
      data: catalog.map((doc) => ({
        isbn: doc.isbn,
        title: doc.title,
        author: doc.author,
        coverUrl: doc.coverUrl || null,
        category: doc.category,
        ...timestamps(doc),
      })),
    }),
    prisma.reservation.createMany({
      data: reservations.map((doc) => ({
        isbn: doc.isbn,
        title: doc.title,
        author: doc.author,
        customerName: doc.customerName,
        phone: doc.phone,
        email: doc.email || null,
        status: doc.status ?? "pending",
        ...timestamps(doc),
      })),
    }),
    // The password is already a bcrypt hash and the token is kept, so the booksellers stay signed in
    prisma.admin.createMany({
      data: admins.map((doc) => ({ email: doc.email, password: doc.password, token: doc.token })),
    }),
  ]);

  console.log(
    `Copied: ${events.length} events, ${picks.length} picks, ${catalog.length} catalogue books, ` +
      `${reservations.length} reservations, ${admins.length} admins`
  );

  await mongoose.disconnect();
  await prisma.$disconnect();
}

copyFromMongo();
