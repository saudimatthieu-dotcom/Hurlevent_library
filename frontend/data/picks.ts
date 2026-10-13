import type { Book } from "@/types/Book";

// Test data (ISBNs checked on Open Library) — replace with the shop's real picks
export const picks: Book[] = [
  {
    isbn: "9782070360024",
    title: "L’Étranger",
    author: "Albert Camus",
    note: "Un classique qu’on relit à chaque âge.",
  },
  {
    isbn: "9782253004226",
    title: "Germinal",
    author: "Émile Zola",
    note: "Le roman de la mine, toujours aussi fort.",
  },
  {
    isbn: "9782070368228",
    title: "1984",
    author: "George Orwell",
  },
];
