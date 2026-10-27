import type { CatalogBook } from "@/types/Book";

// Test data until the shop sends its real ISBN list
export const catalog: CatalogBook[] = [
  { isbn: "9782070360024", title: "L'Étranger", author: "Albert Camus", category: "Roman" },
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
