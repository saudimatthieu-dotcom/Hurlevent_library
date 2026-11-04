import styles from "@/styles/Picks.module.css";
import BookCard from "@/components/BookCard";
import type { Pick } from "@/types/Book";

type PicksProps = {
  picks: Pick[];
};

export default function Picks({ picks }: PicksProps) {
  if (picks.length === 0) {
    return null;
  }

  return (
    <section className={styles.picks}>
      <h2 className={styles.title}>Nos coups de cœur</h2>
      <div className={styles.grid}>
        {/* Mongo: key={book._id} */}
        {picks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}
