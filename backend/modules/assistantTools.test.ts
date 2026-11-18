// Prisma is replaced by a fake: these tests never touch the database
const mockFindMany = jest.fn();
jest.mock("../models/prisma", () => ({
  __esModule: true,
  default: { catalogBook: { findMany: (...args: unknown[]) => mockFindMany(...args) } },
}));

import { z } from "zod";
import { executeTool, toSearchWords } from "./assistantTools";

const mockFetch = jest.fn();

beforeEach(() => {
  mockFetch.mockReset();
  mockFindMany.mockReset();
  global.fetch = mockFetch as unknown as typeof fetch;
});

function googleAnswer(body: object) {
  return { ok: true, json: async () => body };
}

describe("toSearchWords", () => {
  it("splits on spaces and punctuation, and keeps accents", () => {
    expect(toSearchWords("Arsène Lupin, gentleman-cambrioleur !")).toEqual([
      "Arsène",
      "Lupin",
      "gentleman",
      "cambrioleur",
    ]);
  });

  it("keeps numbers, so an ISBN can be searched", () => {
    expect(toSearchWords("1984")).toEqual(["1984"]);
  });

  it("returns no word for punctuation only", () => {
    expect(toSearchWords(" , !? ")).toEqual([]);
  });

  it("keeps at most 6 words", () => {
    expect(toSearchWords("un deux trois quatre cinq six sept huit")).toHaveLength(6);
  });
});

describe("search_catalog", () => {
  it("requires every word to match the title, the author or the category", async () => {
    mockFindMany.mockResolvedValueOnce([]);

    await executeTool("search_catalog", { query: "Lupin Leblanc" });

    const where = mockFindMany.mock.calls[0][0].where;
    expect(where.AND).toHaveLength(2);
    expect(where.AND[0].OR[0].title.contains).toBe("Lupin");
    expect(where.AND[1].OR[1].author.contains).toBe("Leblanc");
  });

  it("returns nothing without querying the database when there is no word", async () => {
    expect(await executeTool("search_catalog", { query: "?!" })).toEqual([]);
    expect(mockFindMany).not.toHaveBeenCalled();
  });
});

describe("get_book_details", () => {
  it("rejects an invalid ISBN before calling Google Books", async () => {
    await expect(executeTool("get_book_details", { isbn: "abc" })).rejects.toBeInstanceOf(z.ZodError);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("returns the description of the book", async () => {
    mockFetch.mockResolvedValueOnce(
      googleAnswer({
        totalItems: 1,
        items: [{ volumeInfo: { title: "Arsène Lupin", authors: ["Maurice Leblanc"], description: "Un gentleman cambrioleur…" } }],
      })
    );

    const result = await executeTool("get_book_details", { isbn: "9782013225588" });

    expect(String(mockFetch.mock.calls[0][0])).toContain("isbn%3A9782013225588");
    expect(result).toMatchObject({ found: true, title: "Arsène Lupin", description: "Un gentleman cambrioleur…" });
  });

  it("caps a long description at 1500 characters", async () => {
    mockFetch.mockResolvedValueOnce(
      googleAnswer({ totalItems: 1, items: [{ volumeInfo: { title: "Long", description: "a".repeat(5000) } }] })
    );

    const result = (await executeTool("get_book_details", { isbn: "9782013225588" })) as { description: string };

    expect(result.description).toHaveLength(1500);
  });

  it("says when Google Books doesn't know the book", async () => {
    mockFetch.mockResolvedValueOnce(googleAnswer({ totalItems: 0 }));

    expect(await executeTool("get_book_details", { isbn: "9782013225588" })).toEqual({ found: false });
  });
});
