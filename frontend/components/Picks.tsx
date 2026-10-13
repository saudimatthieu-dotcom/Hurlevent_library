import styles from "@/styles/Picks.module.css";
import BookCard from "@/components/BookCard";
import { picks } from "@/data/picks";

export default function Picks() {
  return (
    <section className={styles.picks}>
      <h2 className={styles.title}>Nos coups de cœur</h2>
      <div className={styles.grid}>
        {picks.map((book) => (
          <BookCard key={book.isbn} book={book} />
        ))}
      </div>
    </section>
  );
}
