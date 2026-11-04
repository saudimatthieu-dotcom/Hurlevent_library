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

export type CatalogBook = Book & {
  // Mongo: _id: string;
  id: number;
  category: string;
};
