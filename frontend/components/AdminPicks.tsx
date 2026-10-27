import { useEffect, useState } from "react";
import BookPicker from "@/components/BookPicker";
import styles from "@/styles/Admin.module.css";
import type { AdminTabProps } from "@/types/AdminTabProps";
import type { Book, Pick } from "@/types/Book";
import { apiRequest, NETWORK_ERROR } from "@/utils/api";

type PickRowProps = AdminTabProps & {
  pick: Pick;
  onSaved: (pick: Pick) => void;
  onRemoved: (id: string) => void;
};

function PickRow({ pick, token, onUnauthorized, onSaved, onRemoved }: PickRowProps) {
  const [note, setNote] = useState(pick.note ?? "");
  const [message, setMessage] = useState<string | null>(null);

  async function saveNote() {
    const data = await apiRequest<{ pick: Pick }>(`/picks/${pick._id}`, "PUT", { token, note });
    if (!data) {
      setMessage(NETWORK_ERROR);
      return;
    }
    if (!data.result) {
      onUnauthorized();
      return;
    }
    onSaved(data.pick);
    setMessage("Note enregistrée.");
  }

  async function remove() {
    if (!window.confirm(`Retirer « ${pick.title} » des coups de cœur ?`)) {
      return;
    }
    const data = await apiRequest(`/picks/${pick._id}`, "DELETE", { token });
    if (!data) {
      setMessage(NETWORK_ERROR);
      return;
    }
    if (!data.result) {
      onUnauthorized();
      return;
    }
    onRemoved(pick._id);
  }

  return (
    <li className={styles.item}>
      <div className={styles.grow}>
        <h3 className={styles.bookTitle}>{pick.title}</h3>
        <p className={styles.muted}>{pick.author}</p>
        <label className={styles.field}>
          Note du libraire
          <textarea rows={2} value={note} onChange={(event) => setNote(event.target.value)} />
        </label>
        {message && <p className={styles.muted}>{message}</p>}
      </div>
      <div className={styles.actions}>
        <button className={styles.secondary} onClick={saveNote}>
          Enregistrer la note
        </button>
        <button className={styles.danger} onClick={remove}>
          Retirer
        </button>
      </div>
    </li>
  );
}

export default function AdminPicks({ token, onUnauthorized }: AdminTabProps) {
  const [picks, setPicks] = useState<Pick[]>([]);
  const [chosenBook, setChosenBook] = useState<Book | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiRequest<{ picks: Pick[] }>("/picks").then((data) => {
      if (!data) {
        setError(NETWORK_ERROR);
      } else if (data.result) {
        setPicks(data.picks);
      }
    });
  }, []);

  async function addPick() {
    if (!chosenBook) {
      return;
    }
    const data = await apiRequest<{ pick: Pick }>("/picks", "POST", { token, ...chosenBook, note });
    if (!data) {
      setError(NETWORK_ERROR);
      return;
    }
    if (!data.result) {
      if (data.error === "Not authorized") {
        onUnauthorized();
      } else {
        setError("Ce livre est déjà dans les coups de cœur.");
      }
      return;
    }
    setPicks([data.pick, ...picks]);
    setChosenBook(null);
    setNote("");
    setError(null);
  }

  return (
    <div className={styles.tabContent}>
      <div className={styles.form}>
        <h2 className={styles.formTitle}>Ajouter un coup de cœur</h2>
        {chosenBook ? (
          <>
            <p>
              <strong>{chosenBook.title}</strong> · {chosenBook.author}
            </p>
            <label className={styles.field}>
              Note du libraire (facultatif)
              <textarea rows={2} value={note} onChange={(event) => setNote(event.target.value)} />
            </label>
            <div className={styles.actions}>
              <button className={styles.secondary} onClick={() => setChosenBook(null)}>
                Changer de livre
              </button>
              <button className={styles.primary} onClick={addPick}>
                Ajouter aux coups de cœur
              </button>
            </div>
          </>
        ) : (
          <BookPicker onPick={setChosenBook} />
        )}
        {error && <p className={styles.error}>{error}</p>}
      </div>

      {picks.length === 0 && <p>Aucun coup de cœur pour le moment.</p>}
      <ul className={styles.list}>
        {picks.map((pick) => (
          <PickRow
            key={pick._id}
            pick={pick}
            token={token}
            onUnauthorized={onUnauthorized}
            onSaved={(saved) => setPicks(picks.map((item) => (item._id === saved._id ? saved : item)))}
            onRemoved={(id) => setPicks(picks.filter((item) => item._id !== id))}
          />
        ))}
      </ul>
    </div>
  );
}
