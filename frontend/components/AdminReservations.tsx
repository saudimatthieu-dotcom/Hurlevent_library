import { useEffect, useState } from "react";
import styles from "@/styles/Admin.module.css";
import type { AdminTabProps } from "@/types/AdminTabProps";
import type { Reservation, ReservationStatus } from "@/types/Reservation";
import { apiRequest, NETWORK_ERROR } from "@/utils/api";

const STATUS_LABELS: Record<ReservationStatus, string> = {
  pending: "En attente",
  ready: "Prêt",
  collected: "Retiré",
  cancelled: "Annulé",
};

const NEXT_ACTIONS: Record<ReservationStatus, { status: ReservationStatus; label: string }[]> = {
  pending: [
    { status: "ready", label: "Marquer prêt" },
    { status: "cancelled", label: "Annuler" },
  ],
  ready: [
    { status: "collected", label: "Marquer retiré" },
    { status: "cancelled", label: "Annuler" },
  ],
  collected: [],
  cancelled: [],
};

export default function AdminReservations({ token, onUnauthorized }: AdminTabProps) {
  const [reservations, setReservations] = useState<Reservation[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiRequest<{ reservations: Reservation[] }>(`/reservations/${token}`).then((data) => {
      if (!data) {
        setError(NETWORK_ERROR);
      } else if (!data.result) {
        onUnauthorized();
      } else {
        setReservations(data.reservations);
      }
    });
  }, [token, onUnauthorized]);

  async function updateStatus(id: string, status: ReservationStatus) {
    const data = await apiRequest<{ reservation: Reservation }>(`/reservations/${id}/status`, "PUT", { token, status });
    if (!data) {
      setError(NETWORK_ERROR);
      return;
    }
    if (!data.result) {
      onUnauthorized();
      return;
    }
    setError(null);
    setReservations((current) =>
      (current ?? []).map((reservation) => (reservation._id === id ? data.reservation : reservation))
    );
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }
  if (!reservations) {
    return <p>Chargement…</p>;
  }
  if (reservations.length === 0) {
    return <p>Aucune réservation pour le moment.</p>;
  }

  return (
    <ul className={styles.list}>
      {reservations.map((reservation) => (
        <li key={reservation._id} className={styles.item}>
          <div>
            <h2 className={styles.bookTitle}>{reservation.title}</h2>
            <p className={styles.muted}>
              {reservation.author} · ISBN {reservation.isbn}
            </p>
            <p>
              {reservation.customerName} · <a href={`tel:${reservation.phone}`}>{reservation.phone}</a>
              {reservation.email && (
                <>
                  {" · "}
                  <a href={`mailto:${reservation.email}`}>{reservation.email}</a>
                </>
              )}
            </p>
            <p className={styles.muted}>
              Reçue le {new Date(reservation.createdAt).toLocaleDateString("fr-FR")}
            </p>
          </div>

          <div className={styles.actions}>
            <span className={`${styles.status} ${styles[reservation.status]}`}>
              {STATUS_LABELS[reservation.status]}
            </span>
            {NEXT_ACTIONS[reservation.status].map((action) => (
              <button
                key={action.status}
                className={styles.secondary}
                onClick={() => updateStatus(reservation._id, action.status)}
              >
                {action.label}
              </button>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}
