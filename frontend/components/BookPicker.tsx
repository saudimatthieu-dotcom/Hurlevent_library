import { useState } from "react";
import styles from "@/styles/Admin.module.css";
import type { Book } from "@/types/Book";
import { apiRequest, NETWORK_ERROR } from "@/utils/api";

type BookPickerProps = {
  onPick: (book: Book) => void;
};

export default function BookPicker({ onPick }: BookPickerProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Book[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch() {
    if (query.trim() === "") {
      return;
    }
    setError(null);
    const data = await apiRequest<{ books: Book[] }>(`/books/search?q=${encodeURIComponent(query)}`);
    if (!data) {
      setError(NETWORK_ERROR);
      return;
    }
    if (!data.result) {
      setError("La recherche a échoué, réessayez dans un instant.");
      return;
    }
    setResults(data.books);
  }

  return (
    <div className={styles.picker}>
      <form
        className={styles.inline}
        onSubmit={(event) => {
          event.preventDefault();
          handleSearch();
        }}
      >
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Titre, auteur ou ISBN"
          aria-label="Rechercher un livre"
        />
        <button type="submit" className={styles.secondary}>
          Rechercher
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}
      {results && results.length === 0 && <p className={styles.muted}>Aucun livre trouvé.</p>}

      {results && results.length > 0 && (
        <ul className={styles.pickerResults}>
          {results.map((book) => (
            <li key={book.isbn} className={styles.pickerRow}>
              <span>
                <strong>{book.title}</strong> · {book.author}
                <span className={styles.muted}> · ISBN {book.isbn}</span>
              </span>
              <button
                className={styles.secondary}
                onClick={() => {
                  onPick(book);
                  setResults(null);
                  setQuery("");
                }}
              >
                Choisir
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
