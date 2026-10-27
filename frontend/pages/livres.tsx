import Head from "next/head";
import type { GetServerSideProps } from "next";
import { useState } from "react";
import BookCard from "@/components/BookCard";
import ReservationForm from "@/components/ReservationForm";
import type { Book, CatalogBook } from "@/types/Book";
import styles from "@/styles/Books.module.css";
import { apiRequest, NETWORK_ERROR } from "@/utils/api";

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
      setError(NETWORK_ERROR);
      return;
    }
    if (!data.result) {
      setError("La recherche a échoué, réessayez dans un instant.");
      return;
    }

    setSearchedQuery(query);
    setResults(data.books);
  }

  return (
    <>
      <Head>
        <title>Parcourir les livres — Librairie Hurlevent</title>
        <meta
          name="description"
          content="Parcourez les livres de la librairie Hurlevent, réservez-les en ligne et venez les retirer au 238 rue de Belleville. Paiement sur place."
        />
      </Head>
      <section className={styles.page}>
        <h1 className={styles.pageTitle}>Parcourir les livres</h1>
        <p className={styles.intro}>
          Parcourez nos livres, réservez-les en ligne et venez les retirer en
          librairie. Le paiement se fait sur place.
        </p>

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
            placeholder="Titre, auteur, ISBN…"
            aria-label="Rechercher un livre"
          />
          <button type="submit" className={styles.searchButton} disabled={isSearching}>
            {isSearching ? "Recherche…" : "Rechercher"}
          </button>
        </form>

        {error && <p className={styles.error}>{error}</p>}

        {results && (
          <div className={styles.results}>
            <div className={styles.resultsTop}>
              <h2 className={styles.categoryTitle}>Résultats pour « {searchedQuery} »</h2>
              <button className={styles.clear} onClick={() => setResults(null)}>
                Effacer
              </button>
            </div>
            {results.length === 0 ? (
              <p>Aucun livre trouvé. Essayez avec un autre titre ou le nom de l’auteur.</p>
            ) : (
              <>
                <p className={styles.hint}>
                  Un livre n’est pas en rayon ? Réservez-le quand même : nous le commandons pour vous.
                </p>
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
          <p className={styles.hint}>Le catalogue en ligne arrive bientôt. En attendant, utilisez la recherche.</p>
        ) : (
          <nav className={styles.categoryNav} aria-label="Catégories">
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
                  <BookCard key={book._id} book={book} onReserve={setSelectedBook} />
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
