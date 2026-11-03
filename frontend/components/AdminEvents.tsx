import { useEffect, useState } from "react";
import styles from "@/styles/Admin.module.css";
import type { AdminTabProps } from "@/types/AdminTabProps";
import type { ShopEvent } from "@/types/ShopEvent";
import { apiRequest, NETWORK_ERROR } from "@/utils/api";

type EventForm = Omit<ShopEvent, "id">;

const EMPTY_FORM: EventForm = { title: "", date: "", time: "", description: "" };

function sortByDateDesc(events: ShopEvent[]): ShopEvent[] {
  return [...events].sort((a, b) => b.date.localeCompare(a.date));
}

export default function AdminEvents({ token, onUnauthorized }: AdminTabProps) {
  const [events, setEvents] = useState<ShopEvent[]>([]);
  const [form, setForm] = useState<EventForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiRequest<{ events: ShopEvent[] }>("/events").then((data) => {
      if (!data) {
        setError(NETWORK_ERROR);
      } else if (data.result) {
        setEvents(sortByDateDesc(data.events));
      }
    });
  }, []);

  function updateField(field: keyof EventForm, value: string) {
    setForm({ ...form, [field]: value });
  }

  function startEditing(event: ShopEvent) {
    setEditingId(event.id);
    setForm({ title: event.title, date: event.date, time: event.time, description: event.description });
    setError(null);
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit() {
    if (Object.values(form).some((value) => value.trim() === "")) {
      setError("Merci de remplir tous les champs.");
      return;
    }

    const data = editingId
      ? await apiRequest<{ event: ShopEvent }>(`/events/${editingId}`, "PUT", { token, ...form })
      : await apiRequest<{ event: ShopEvent }>("/events", "POST", { token, ...form });

    if (!data) {
      setError(NETWORK_ERROR);
      return;
    }
    if (!data.result) {
      if (data.error === "Not authorized") {
        onUnauthorized();
      } else {
        setError("L’enregistrement a échoué. Vérifiez la date.");
      }
      return;
    }

    const others = events.filter((event) => event.id !== data.event.id);
    setEvents(sortByDateDesc([...others, data.event]));
    setError(null);
    resetForm();
  }

  async function handleDelete(event: ShopEvent) {
    if (!window.confirm(`Supprimer « ${event.title} » ?`)) {
      return;
    }
    const data = await apiRequest(`/events/${event.id}`, "DELETE", { token });
    if (!data) {
      setError(NETWORK_ERROR);
      return;
    }
    if (!data.result) {
      onUnauthorized();
      return;
    }
    setEvents(events.filter((item) => item.id !== event.id));
    if (editingId === event.id) {
      resetForm();
    }
  }

  return (
    <div className={styles.tabContent}>
      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <h2 className={styles.formTitle}>{editingId ? "Modifier la rencontre" : "Ajouter une rencontre"}</h2>
        <label className={styles.field}>
          Titre
          <input value={form.title} onChange={(event) => updateField("title", event.target.value)} />
        </label>
        <div className={styles.row}>
          <label className={styles.field}>
            Date
            <input type="date" value={form.date} onChange={(event) => updateField("date", event.target.value)} />
          </label>
          <label className={styles.field}>
            Heure
            <input
              value={form.time}
              onChange={(event) => updateField("time", event.target.value)}
              placeholder="19h00"
            />
          </label>
        </div>
        <label className={styles.field}>
          Description
          <textarea
            rows={3}
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
          />
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          {editingId && (
            <button type="button" className={styles.secondary} onClick={resetForm}>
              Annuler
            </button>
          )}
          <button type="submit" className={styles.primary}>
            {editingId ? "Enregistrer" : "Ajouter"}
          </button>
        </div>
      </form>

      <ul className={styles.list}>
        {events.map((event) => (
          <li key={event.id} className={styles.item}>
            <div>
              <h3 className={styles.bookTitle}>{event.title}</h3>
              <p className={styles.muted}>
                {new Date(event.date).toLocaleDateString("fr-FR")} · {event.time}
              </p>
              <p>{event.description}</p>
            </div>
            <div className={styles.actions}>
              <button className={styles.secondary} onClick={() => startEditing(event)}>
                Modifier
              </button>
              <button className={styles.danger} onClick={() => handleDelete(event)}>
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
