import Head from "next/head";
import type { GetServerSideProps } from "next";
import { useState } from "react";
import BookCard from "@/components/BookCard";
import ReservationForm from "@/components/ReservationForm";
import type { Book, CatalogBook } from "@/types/Book";
import styles from "@/styles/Books.module.css";
import { apiRequest } from "@/utils/api";
import { useTranslation } from "@/utils/i18n";

type BooksPageProps = {
  catalog: CatalogBook[];
};

export const getServerSideProps: GetServerSideProps<BooksPageProps> = async () => {
  const data = await apiRequest<{ books: CatalogBook[] }>("/catalog");
  return { props: { catalog: data?.result ? data.books : [] } };
};

// "Bande dessinée" → "bande-dessinee", used as the anchor of each category
function toAnchor(category: string): string {
  return category
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-");
}

export default function BooksPage({ catalog }: BooksPageProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [searchedQuery, setSearchedQuery] = useState("");
  const [results, setResults] = useState<Book[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const categories = [...new Set(catalog.map((book) => book.category))];

  async function handleSearch() {
    if (query.trim() === "") {
      return;
    }

    setError(null);
    setIsSearching(true);
    const data = await apiRequest<{ books: Book[] }>(`/books/search?q=${encodeURIComponent(query)}`);
    setIsSearching(false);

    if (!data) {
      setError(t.networkError);
      return;
    }
    if (!data.result) {
      setError(t.books.searchFailed);
      return;
    }

    setSearchedQuery(query);
    setResults(data.books);
  }

  return (
    <>
      <Head>
        <title>{t.books.metaTitle}</title>
        <meta name="description" content={t.books.metaDescription} />
      </Head>
      <section className={styles.page}>
        <h1 className={styles.pageTitle}>{t.books.title}</h1>
        <p className={styles.intro}>{t.books.intro}</p>

        <form
          className={styles.search}
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            handleSearch();
          }}
        >
          <input
            type="search"
            className={styles.searchInput}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.books.searchPlaceholder}
            aria-label={t.books.searchLabel}
          />
          <button type="submit" className={styles.searchButton} disabled={isSearching}>
            {isSearching ? t.books.searching : t.books.search}
          </button>
        </form>

        {error && <p className={styles.error}>{error}</p>}

        {results && (
          <div className={styles.results}>
            <div className={styles.resultsTop}>
              <h2 className={styles.categoryTitle}>{t.books.resultsFor(searchedQuery)}</h2>
              <button className={styles.clear} onClick={() => setResults(null)}>
                {t.books.clear}
              </button>
            </div>
            {results.length === 0 ? (
              <p>{t.books.noResults}</p>
            ) : (
              <>
                <p className={styles.hint}>{t.books.orderHint}</p>
                <div className={styles.grid}>
                  {results.map((book) => (
                    <BookCard key={book.isbn} book={book} onReserve={setSelectedBook} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {categories.length === 0 ? (
          <p className={styles.hint}>{t.books.catalogSoon}</p>
        ) : (
          <nav className={styles.categoryNav} aria-label={t.books.categories}>
            {categories.map((category) => (
              <a key={category} href={`#${toAnchor(category)}`} className={styles.categoryLink}>
                {category}
              </a>
            ))}
          </nav>
        )}

        {categories.map((category) => (
          <div key={category} id={toAnchor(category)} className={styles.category}>
            <h2 className={styles.categoryTitle}>{category}</h2>
            <div className={styles.grid}>
              {catalog
                .filter((book) => book.category === category)
                .map((book) => (
                  // Mongo: key={book._id}
                  <BookCard key={book.id} book={book} onReserve={setSelectedBook} />
                ))}
            </div>
          </div>
        ))}

        {selectedBook && (
          <ReservationForm book={selectedBook} onClose={() => setSelectedBook(null)} />
        )}
      </section>
    </>
  );
}
