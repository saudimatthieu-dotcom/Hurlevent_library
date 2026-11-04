import "dotenv/config";
// Mongo: import mongoose from "mongoose";
// Mongo: import Event from "../models/events";
// Mongo: import Pick from "../models/picks";
// Mongo: import CatalogBook from "../models/catalogBooks";
import prisma from "../models/prisma";

// Test content (ISBNs checked on Open Library), until the booksellers add the real one from /admin.
// Each table is only filled when it is empty, so running this twice never duplicates or erases anything.

const events = [
  {
    title: "Rencontre avec Pascal Boniface",
    date: "2026-10-07",
    time: "19h00",
    description: "Rencontre et dédicace autour de son dernier livre.",
  },
  {
    title: "Club de lecture",
    date: "2026-11-05",
    time: "19h30",
    description: "On parle des livres du mois, autour d’un verre.",
  },
];

const picks = [
  { isbn: "9782070360024", title: "L’Étranger", author: "Albert Camus", note: "Un classique qu’on relit à chaque âge." },
  { isbn: "9782253004226", title: "Germinal", author: "Émile Zola", note: "Le roman de la mine, toujours aussi fort." },
  { isbn: "9782070368228", title: "1984", author: "George Orwell" },
];

const catalog = [
  { isbn: "9782070360024", title: "L’Étranger", author: "Albert Camus", category: "Roman" },
  { isbn: "9782253004226", title: "Germinal", author: "Émile Zola", category: "Roman" },
  { isbn: "9782070368228", title: "1984", author: "George Orwell", category: "Roman" },
  { isbn: "9782070413119", title: "Madame Bovary", author: "Gustave Flaubert", category: "Roman" },
  { isbn: "9782070360420", title: "La Peste", author: "Albert Camus", category: "Roman" },
  { isbn: "9782290333693", title: "Le Mystère de la chambre jaune", author: "Gaston Leroux", category: "Polar" },
  { isbn: "9782013225588", title: "Arsène Lupin, gentleman cambrioleur", author: "Maurice Leblanc", category: "Polar" },
  { isbn: "9782070612758", title: "Le Petit Prince", author: "Antoine de Saint-Exupéry", category: "Jeunesse" },
  { isbn: "9782070584628", title: "Harry Potter à l'école des sorciers", author: "J. K. Rowling", category: "Jeunesse" },
  { isbn: "9782012101333", title: "Astérix le Gaulois", author: "René Goscinny, Albert Uderzo", category: "BD" },
  { isbn: "9782203001190", title: "Tintin au Tibet", author: "Hergé", category: "BD" },
  { isbn: "9782253007104", title: "Les Fleurs du mal", author: "Charles Baudelaire", category: "Poésie" },
  { isbn: "9782070202010", title: "Alcools", author: "Guillaume Apollinaire", category: "Poésie" },
  { isbn: "9782070322886", title: "Le Mythe de Sisyphe", author: "Albert Camus", category: "Essais" },
  { isbn: "9782070323517", title: "Le Deuxième Sexe I", author: "Simone de Beauvoir", category: "Essais" },
];

// Mongo: async function fillIfEmpty(name: string, model: mongoose.Model<any>, documents: object[]) {
// Mongo:   if ((await model.countDocuments()) > 0) { ...skipped }
// Mongo:   await model.insertMany(documents);
// Mongo: }
// Each Prisma model has its own types, so instead of one generic helper there are three short blocks
// (count = countDocuments, createMany = insertMany)
function report(name: string, added: number | null) {
  console.log(added === null ? `${name}: already has content, skipped` : `${name}: ${added} added`);
}

async function seed() {
  // Mongo: await mongoose.connect(process.env.CONNECTION_STRING ?? "");

  if ((await prisma.event.count()) > 0) {
    report("events", null);
  } else {
    report("events", (await prisma.event.createMany({ data: events })).count);
  }

  if ((await prisma.pick.count()) > 0) {
    report("picks", null);
  } else {
    report("picks", (await prisma.pick.createMany({ data: picks })).count);
  }

  if ((await prisma.catalogBook.count()) > 0) {
    report("catalog", null);
  } else {
    report("catalog", (await prisma.catalogBook.createMany({ data: catalog })).count);
  }

  // Mongo: await mongoose.disconnect();
  await prisma.$disconnect();
}

seed();
