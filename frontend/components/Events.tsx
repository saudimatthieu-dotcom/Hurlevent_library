import styles from "@/styles/Events.module.css";
import { events } from "@/data/events";

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default function Events() {
  return (
    <section className={styles.events}>
      <h2 className={styles.title}>Rencontres & dédicaces</h2>
      <ul className={styles.list}>
        {events.map((event) => (
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
