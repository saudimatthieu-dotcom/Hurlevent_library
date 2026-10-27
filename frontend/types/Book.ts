export type Book = {
  isbn: string;
  title: string;
  author: string;
  coverUrl?: string;
  note?: string; // the bookseller's comment (optional)
};

export type Pick = Book & {
  _id: string;
};

export type CatalogBook = Book & {
  _id: string;
  category: string;
};
