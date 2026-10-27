import Head from "next/head";
import { useState } from "react";
import BookCard from "@/components/BookCard";
import type { Book } from "@/types/Book";

export default function BooksPage() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch() {
    if (query.trim() === "") {
      return;
    }

    setError(null);
    const response = await fetch(
      `http://localhost:4000/books/search?q=${encodeURIComponent(query)}`
    );
    const data = await response.json();

    if (!data.result) {
      setError("La recherche a échoué, réessayez dans un instant.");
      setBooks([]);
      return;
    }

    setBooks(data.books);
  }

  return (
    <>
      <Head>
        <title>Parcourir les livres — Librairie Hurlevent</title>
      </Head>
      <section style={{ padding: "4rem 2rem" }}>
        <h1>Parcourir les livres</h1>
        <p>
          Parcourez nos livres, réservez-les en ligne et venez les retirer en
          librairie. Le paiement se fait sur place.
        </p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSearch();
          }}
        >
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Titre, auteur, ISBN…"
          />
          <button type="submit">Rechercher</button>
        </form>

        {error && <p>{error}</p>}

        <div>
          {books.map((book) => (
            <BookCard key={book.isbn} book={book} />
          ))}
        </div>
      </section>
    </>
  );
}
