import { useState } from "react";
import styles from "@/styles/ReservationForm.module.css";
import type { Book } from "@/types/Book";
import { apiRequest, NETWORK_ERROR } from "@/utils/api";

type ReservationFormProps = {
  book: Book;
  onClose: () => void;
};

export default function ReservationForm({ book, onClose }: ReservationFormProps) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function handleSubmit() {
    if (customerName.trim() === "" || phone.trim() === "") {
      setError("Merci d'indiquer votre nom et votre téléphone.");
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
      setError(NETWORK_ERROR);
      return;
    }
    if (!data.result) {
      setError("La réservation a échoué, réessayez dans un instant.");
      return;
    }

    setIsSent(true);
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="reservation-title">
      <div className={styles.panel}>
        <h2 id="reservation-title" className={styles.title}>
          Réserver « {book.title} »
        </h2>
        <p className={styles.author}>{book.author}</p>

        {isSent ? (
          <>
            <p>
              Merci ! Votre réservation est enregistrée. La librairie vous
              contactera dès que le livre sera prêt. Le paiement se fait sur place.
            </p>
            <button className={styles.primary} onClick={onClose}>
              Fermer
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
              Nom
              <input
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                autoComplete="name"
              />
            </label>
            <label className={styles.field}>
              Téléphone
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                autoComplete="tel"
              />
            </label>
            <label className={styles.field}>
              Email (facultatif)
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
                Annuler
              </button>
              <button type="submit" className={styles.primary} disabled={isSending}>
                {isSending ? "Envoi…" : "Réserver"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
