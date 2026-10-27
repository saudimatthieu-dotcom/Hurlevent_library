import { useEffect, useState } from "react";
import BookPicker from "@/components/BookPicker";
import styles from "@/styles/Admin.module.css";
import type { AdminTabProps } from "@/types/AdminTabProps";
import type { Book, CatalogBook } from "@/types/Book";
import { apiRequest, NETWORK_ERROR } from "@/utils/api";

function sortCatalog(books: CatalogBook[]): CatalogBook[] {
  return [...books].sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title));
}

export default function AdminCatalog({ token, onUnauthorized }: AdminTabProps) {
  const [books, setBooks] = useState<CatalogBook[]>([]);
  const [chosenBook, setChosenBook] = useState<Book | null>(null);
  const [category, setCategory] = useState("");
  const [error, setError] = useState<string | null>(null);

  const categories = [...new Set(books.map((book) => book.category))];

  useEffect(() => {
    apiRequest<{ books: CatalogBook[] }>("/catalog").then((data) => {
      if (!data) {
        setError(NETWORK_ERROR);
      } else if (data.result) {
        setBooks(data.books);
      }
    });
  }, []);

  async function addBook() {
    if (!chosenBook) {
      return;
    }
    if (category.trim() === "") {
      setError("Choisissez une catégorie.");
      return;
    }
    const data = await apiRequest<{ book: CatalogBook }>("/catalog", "POST", {
      token,
      ...chosenBook,
      category: category.trim(),
    });
    if (!data) {
      setError(NETWORK_ERROR);
      return;
    }
    if (!data.result) {
      if (data.error === "Not authorized") {
        onUnauthorized();
      } else {
        setError("Ce livre est déjà dans le catalogue.");
      }
      return;
    }
    setBooks(sortCatalog([...books, data.book]));
    setChosenBook(null);
    setError(null);
  }

  async function removeBook(book: CatalogBook) {
    if (!window.confirm(`Retirer « ${book.title} » du catalogue ?`)) {
      return;
    }
    const data = await apiRequest(`/catalog/${book._id}`, "DELETE", { token });
    if (!data) {
      setError(NETWORK_ERROR);
      return;
    }
    if (!data.result) {
      onUnauthorized();
      return;
    }
    setBooks(books.filter((item) => item._id !== book._id));
  }

  return (
    <div className={styles.tabContent}>
      <div className={styles.form}>
        <h2 className={styles.formTitle}>Ajouter un livre au catalogue</h2>
        {chosenBook ? (
          <>
            <p>
              <strong>{chosenBook.title}</strong> · {chosenBook.author}
            </p>
            <label className={styles.field}>
              Catégorie
              <input
                list="catalog-categories"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                placeholder="Roman, Polar, Jeunesse…"
              />
              <datalist id="catalog-categories">
                {categories.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>
            </label>
            <div className={styles.actions}>
              <button className={styles.secondary} onClick={() => setChosenBook(null)}>
                Changer de livre
              </button>
              <button className={styles.primary} onClick={addBook}>
                Ajouter au catalogue
              </button>
            </div>
          </>
        ) : (
          <BookPicker onPick={setChosenBook} />
        )}
        {error && <p className={styles.error}>{error}</p>}
      </div>

      {categories.map((item) => (
        <div key={item}>
          <h3 className={styles.formTitle}>{item}</h3>
          <ul className={styles.list}>
            {books
              .filter((book) => book.category === item)
              .map((book) => (
                <li key={book._id} className={styles.item}>
                  <span>
                    <strong>{book.title}</strong> · {book.author}
                  </span>
                  <button className={styles.danger} onClick={() => removeBook(book)}>
                    Retirer
                  </button>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
