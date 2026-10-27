import "dotenv/config";
import mongoose from "mongoose";
import Event from "../models/events";
import Pick from "../models/picks";
import CatalogBook from "../models/catalogBooks";

// Test content (ISBNs checked on Open Library), until the booksellers add the real one from /admin.
// Each collection is only filled when it is empty, so running this twice never duplicates or erases anything.

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

async function fillIfEmpty(name: string, model: mongoose.Model<any>, documents: object[]) {
  if ((await model.countDocuments()) > 0) {
    console.log(`${name}: already has content, skipped`);
    return;
  }
  await model.insertMany(documents);
  console.log(`${name}: ${documents.length} added`);
}

async function seed() {
  await mongoose.connect(process.env.CONNECTION_STRING ?? "");
  await fillIfEmpty("events", Event, events);
  await fillIfEmpty("picks", Pick, picks);
  await fillIfEmpty("catalog", CatalogBook, catalog);
  await mongoose.disconnect();
}

seed();
