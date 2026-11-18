import { useState } from "react";
import styles from "@/styles/ReservationForm.module.css";
import type { Book } from "@/types/Book";
import { apiRequest } from "@/utils/api";
import { useTranslation } from "@/utils/i18n";

type ReservationFormProps = {
  book: Book;
  onClose: () => void;
};

export default function ReservationForm({ book, onClose }: ReservationFormProps) {
  const { t } = useTranslation();
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function handleSubmit() {
    if (customerName.trim() === "" || phone.trim() === "") {
      setError(t.reservation.missingFields);
      return;
    }

    setError(null);
    setIsSending(true);
    const data = await apiRequest("/reservations", "POST", {
      isbn: book.isbn,
      title: book.title,
      author: book.author,
      customerName,
      phone,
      email: email.trim() || undefined,
    });
    setIsSending(false);

    if (!data) {
      setError(t.networkError);
      return;
    }
    if (!data.result) {
      setError(t.reservation.failed);
      return;
    }

    setIsSent(true);
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="reservation-title">
      <div className={styles.panel}>
        <h2 id="reservation-title" className={styles.title}>
          {t.reservation.title(book.title)}
        </h2>
        <p className={styles.author}>{book.author}</p>

        {isSent ? (
          <>
            <p>{t.reservation.thanks}</p>
            <button className={styles.primary} onClick={onClose}>
              {t.reservation.close}
            </button>
          </>
        ) : (
          <form
            className={styles.form}
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit();
            }}
          >
            <label className={styles.field}>
              {t.reservation.name}
              <input
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                autoComplete="name"
              />
            </label>
            <label className={styles.field}>
              {t.reservation.phone}
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                autoComplete="tel"
              />
            </label>
            <label className={styles.field}>
              {t.reservation.email}
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
            </label>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.actions}>
              <button type="button" className={styles.secondary} onClick={onClose}>
                {t.reservation.cancel}
              </button>
              <button type="submit" className={styles.primary} disabled={isSending}>
                {isSending ? t.reservation.sending : t.reservation.send}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
