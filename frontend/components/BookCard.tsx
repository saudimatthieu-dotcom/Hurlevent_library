import Image from "next/image";
import { useState } from "react";
import styles from "@/styles/BookCard.module.css";
import type { Book } from "@/types/Book";

type BookCardProps = {
  book: Book;
  onReserve?: (book: Book) => void;
};

function coverSources(book: Book): string[] {
  // default=false makes Open Library answer 404 instead of a blank image when it has no cover
  const sources = [`https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg?default=false`];
  if (book.coverUrl) {
    sources.push(book.coverUrl);
  }
  return sources;
}

export default function BookCard({ book, onReserve }: BookCardProps) {
  const [attempt, setAttempt] = useState(0);
  const cover = coverSources(book)[attempt];

  return (
    <article className={styles.card}>
      {cover ? (
        <Image
          src={cover}
          alt={`Couverture de ${book.title}`}
          width={180}
          height={270}
          className={styles.cover}
          onError={() => setAttempt(attempt + 1)}
        />
      ) : (
        <div className={styles.placeholder} aria-hidden="true">
          <span>{book.title}</span>
        </div>
      )}
      <h3 className={styles.title}>{book.title}</h3>
      <p className={styles.author}>{book.author}</p>
      {book.note && <p className={styles.note}>« {book.note} »</p>}
      {onReserve && (
        <button className={styles.reserveButton} onClick={() => onReserve(book)}>
          Réserver
        </button>
      )}
    </article>
  );
}
