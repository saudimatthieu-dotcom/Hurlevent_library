import { Router } from "express";
import type { Book } from "../types/Book";
import type { GoogleBooksResponse, GoogleBooksVolume } from "../types/GoogleBooks";

const router = Router();

function toBook(volume: GoogleBooksVolume): Book | null {
  const info = volume.volumeInfo;
  const isbn = info.industryIdentifiers?.find((id) => id.type === "ISBN_13")?.identifier;

  if (!isbn || !info.title || info.language !== "fr") {
    return null;
  }

  return {
    isbn,
    title: info.title,
    author: info.authors?.join(", ") ?? "Auteur inconnu",
    coverUrl: info.imageLinks?.thumbnail?.replace("http://", "https://"),
  };
}

router.get("/search", async (req, res) => {
  const query = req.query.q;
  if (typeof query !== "string" || query.trim() === "") {
    res.status(400).json({ result: false, error: "Missing search query" });
    return;
  }

  const url = new URL("https://www.googleapis.com/books/v1/volumes");
  url.searchParams.set("q", query);
  url.searchParams.set("langRestrict", "fr");
  url.searchParams.set("printType", "books");
  url.searchParams.set("maxResults", "20");
  url.searchParams.set("key", process.env.GOOGLE_BOOKS_API_KEY ?? "");

  const response = await fetch(url);
  if (!response.ok) {
    res.status(502).json({ result: false, error: "Book search failed" });
    return;
  }

  const data = (await response.json()) as GoogleBooksResponse;
  const books = (data.items ?? []).map(toBook).filter((book) => book !== null);

  res.json({ result: true, books });
});

export default router;
