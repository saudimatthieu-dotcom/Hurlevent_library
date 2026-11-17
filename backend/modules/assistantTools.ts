import { z } from "zod";
import type Groq from "groq-sdk";
import prisma from "../models/prisma";

type Tool = Groq.Chat.ChatCompletionTool;

// What the model may send us. zod checks it before anything reaches Prisma.
const searchCatalogInput = z.object({
  query: z.string().trim().min(1).max(100),
  limit: z.number().int().min(1).max(10).default(5),
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
];

async function searchCatalog({ query, limit }: z.infer<typeof searchCatalogInput>) {
  const matches = { contains: query, mode: "insensitive" as const };
  return prisma.catalogBook.findMany({
    where: { OR: [{ title: matches }, { author: matches }, { category: matches }] },
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
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
