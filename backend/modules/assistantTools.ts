import { z } from "zod";
import type Groq from "groq-sdk";
import prisma from "../models/prisma";
import type { GoogleBooksResponse } from "../types/GoogleBooks";

type Tool = Groq.Chat.ChatCompletionTool;

// What the model may send us. zod checks it before anything reaches Prisma or Google Books.
const searchCatalogInput = z.object({
  query: z.string().trim().min(1).max(100),
  limit: z.number().int().min(1).max(10).default(5),
});
const bookDetailsInput = z.object({
  isbn: z.string().trim().regex(/^\d{10}(\d{3})?$/, "ISBN must be 10 or 13 digits"),
});
const noInput = z.object({});

// What the model sees: a name, a description, and the shape of the input
export const tools: Tool[] = [
  {
    type: "function",
    function: {
      name: "search_catalog",
      description:
        "Search the shop's catalogue. The text is matched against title, author and category (e.g. Roman, Polar, Jeunesse, BD, Poésie, Essais). Returns up to `limit` books.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "A word to look for: part of a title, an author, or a category" },
          limit: { type: "integer", description: "Maximum number of books, 1 to 10 (default 5)" },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "list_picks",
      description: "List the booksellers' current favourites (coups de cœur), with their personal notes.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "list_upcoming_events",
      description: "List the shop's upcoming events (author meetings, signings, reading club).",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "get_book_details",
      description:
        "Get the publisher's description of one book from its ISBN. Call it ONLY when the customer explicitly asks for more details about a book or to compare books — never when first suggesting books."
,
      parameters: {
        type: "object",
        properties: {
          isbn: { type: "string", description: "ISBN-10 or ISBN-13, digits only" },
        },
        required: ["isbn"],
      },
    },
  },
];

// Punctuation is ignored, so a missing comma no longer makes the search fail. At most 6 words.
export function toSearchWords(query: string): string[] {
  return query
    .split(/[^\p{L}\p{N}]+/u)
    .filter((word) => word.length > 0)
    .slice(0, 6);
}

async function searchCatalog({ query, limit }: z.infer<typeof searchCatalogInput>) {
  const words = toSearchWords(query);
  // Only punctuation: no word to look for (an empty AND would return the whole catalogue)
  if (words.length === 0) {
    return [];
  }
  // Every word must appear somewhere: in the title, the author or the category
  return prisma.catalogBook.findMany({
    where: {
      AND: words.map((word) => {
        const matches = { contains: word, mode: "insensitive" as const };
        return { OR: [{ title: matches }, { author: matches }, { category: matches }] };
      }),
    },
    select: { isbn: true, title: true, author: true, category: true },
    orderBy: { title: "asc" },
    take: limit,
  });
}

async function listPicks() {
  return prisma.pick.findMany({
    select: { isbn: true, title: true, author: true, note: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
}

async function listUpcomingEvents() {
  const today = new Date().toISOString().slice(0, 10);
  return prisma.event.findMany({
    where: { date: { gte: today } },
    select: { title: true, date: true, time: true, description: true },
    orderBy: { date: "asc" },
    take: 10,
  });
}

// Read-only call to Google Books: the description is fetched, never stored
async function getBookDetails({ isbn }: z.infer<typeof bookDetailsInput>) {
  const url = new URL("https://www.googleapis.com/books/v1/volumes");
  url.searchParams.set("q", `isbn:${isbn}`);
  url.searchParams.set("key", process.env.GOOGLE_BOOKS_API_KEY ?? "");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Google Books answered ${response.status}`);
  }

  const data = (await response.json()) as GoogleBooksResponse;
  const info = data.items?.[0]?.volumeInfo;
  if (!info) {
    return { found: false };
  }

  return {
    found: true,
    title: info.title,
    authors: info.authors,
    // Capped so one long blurb doesn't use up the token quota
    description: info.description?.slice(0, 1500) ?? null,
    publishedDate: info.publishedDate,
    pageCount: info.pageCount,
  };
}

// Throws on unknown tool or invalid input: the loop turns the error into a tool message
export async function executeTool(name: string, input: unknown): Promise<unknown> {
  switch (name) {
    case "search_catalog":
      return searchCatalog(searchCatalogInput.parse(input));
    case "list_picks":
      noInput.parse(input);
      return listPicks();
    case "list_upcoming_events":
      noInput.parse(input);
      return listUpcomingEvents();
    case "get_book_details":
      return getBookDetails(bookDetailsInput.parse(input));
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
