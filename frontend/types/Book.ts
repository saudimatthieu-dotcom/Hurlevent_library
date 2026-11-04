export type Book = {
  isbn: string;
  title: string;
  author: string;
  // Mongo: coverUrl?: string;
  coverUrl?: string | null; // Postgres sends null when there is no cover
  // Mongo: note?: string;
  note?: string | null; // the bookseller's comment (optional)
};

export type Pick = Book & {
  // Mongo: _id: string;
  id: number;
};

// Still on MongoDB until the catalog is moved to Postgres
export type CatalogBook = Book & {
  _id: string;
  category: string;
};
