export type GoogleBooksVolume = {
  volumeInfo: {
    title?: string;
    authors?: string[];
    language?: string;
    industryIdentifiers?: { type: string; identifier: string }[];
    imageLinks?: { thumbnail?: string };
    description?: string;
    publishedDate?: string;
    pageCount?: number;
  };
};

export type GoogleBooksResponse = {
  totalItems: number;
  items?: GoogleBooksVolume[];
};
