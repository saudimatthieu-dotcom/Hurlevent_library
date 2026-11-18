import styles from "@/styles/Picks.module.css";
import BookCard from "@/components/BookCard";
import type { Pick } from "@/types/Book";
import { useTranslation } from "@/utils/i18n";

type PicksProps = {
  picks: Pick[];
};

export default function Picks({ picks }: PicksProps) {
  const { t } = useTranslation();

  if (picks.length === 0) {
    return null;
  }

  return (
    <section className={styles.picks}>
      <h2 className={styles.title}>{t.picks.title}</h2>
      <div className={styles.grid}>
        {/* Mongo: key={book._id} */}
        {picks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}
