import styles from "@/styles/Events.module.css";
import type { ShopEvent } from "@/types/ShopEvent";
import { useState } from "react";
import { useTranslation, type Locale } from "@/utils/i18n";

type EventsProps = {
  events: ShopEvent[];
};

function formatDate(isoDate: string, locale: Locale): string {
  return new Date(isoDate).toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function getToday(): string {
  return new Date().toISOString().slice(0, 10); // "2026-10-13"
}

function getUpcomingEvents(events: ShopEvent[]): ShopEvent[] {
  return events
    .filter((event) => event.date >= getToday())
    .sort((a, b) => a.date.localeCompare(b.date));
}

function getPastEvents(events: ShopEvent[]): ShopEvent[] {
  return events
    .filter((event) => event.date < getToday())
    .sort((a, b) => b.date.localeCompare(a.date));
}

export default function Events({ events }: EventsProps) {
  const { t, locale } = useTranslation();
  const [showPast, setShowPast] = useState(false);
  const upcomingEvents = getUpcomingEvents(events);
  const pastEvents = getPastEvents(events);

  return (
    <section className={styles.events}>
      <h2 className={styles.title}>{t.events.title}</h2>

      {upcomingEvents.length === 0 && <p>{t.events.none}</p>}

      <ul className={styles.list}>
        {upcomingEvents.map((event) => (
          <li key={event.id} className={styles.card}>
            <p className={styles.date}>
              {formatDate(event.date, locale)} · {event.time}
            </p>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
          </li>
        ))}
      </ul>

      {pastEvents.length > 0 && (
        <button
          className={styles.toggle}
          onClick={() => setShowPast(!showPast)}
        >
          {showPast ? t.events.hidePast : t.events.showPast}
        </button>
      )}

      {showPast && (
        <ul className={`${styles.list} ${styles.past}`}>
          {pastEvents.map((event) => (
            <li key={event.id} className={styles.card}>
              <p className={styles.date}>
                {formatDate(event.date, locale)} · {event.time}
              </p>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
