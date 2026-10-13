import styles from "@/styles/Events.module.css";
import { events } from "@/data/events";
import type { ShopEvent } from "@/types/ShopEvent";

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function getUpcomingEvents(): ShopEvent[] {
  const today = new Date().toISOString().slice(0, 10); // "2026-10-13"
  return events
    .filter((event) => event.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export default function Events() {
  const upcomingEvents = getUpcomingEvents();

  return (
    <section className={styles.events}>
      <h2 className={styles.title}>Rencontres & dédicaces</h2>

      {upcomingEvents.length === 0 && (
        <p>Pas de rencontre prévue pour le moment. Suivez-nous sur Instagram !</p>
      )}

      <ul className={styles.list}>
        {upcomingEvents.map((event) => (
          <li key={event.id} className={styles.card}>
            <p className={styles.date}>
              {formatDate(event.date)} · {event.time}
            </p>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
