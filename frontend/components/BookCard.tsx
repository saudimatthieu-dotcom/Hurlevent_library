import Image from "next/image";
import styles from "@/styles/BookCard.module.css";
import type { Book } from "@/types/Book";

type BookCardProps = {
  book: Book;
};

export default function BookCard({ book }: BookCardProps) {
  return (
    <article className={styles.card}>
      <Image
        src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`}
        alt={`Couverture de ${book.title}`}
        width={180}
        height={270}
        className={styles.cover}
      />
      <h3 className={styles.title}>{book.title}</h3>
      <p className={styles.author}>{book.author}</p>
      {book.note && <p className={styles.note}>« {book.note} »</p>}
    </article>
  );
}
