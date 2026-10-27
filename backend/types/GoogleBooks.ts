export type GoogleBooksVolume = {
  volumeInfo: {
    title?: string;
    authors?: string[];
    language?: string;
    industryIdentifiers?: { type: string; identifier: string }[];
    imageLinks?: { thumbnail?: string };
  };
};

export type GoogleBooksResponse = {
  totalItems: number;
  items?: GoogleBooksVolume[];
};
