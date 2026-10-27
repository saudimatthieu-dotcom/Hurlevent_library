import { useEffect, useState } from "react";
import AdminSignIn from "@/components/AdminSignIn";
import styles from "@/styles/Admin.module.css";
import type { Reservation, ReservationStatus } from "@/types/Reservation";
import { API_URL } from "@/utils/api";

const TOKEN_KEY = "adminToken";

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

export default function AdminPanel() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    if (!token) {
      return;
    }

    fetch(`${API_URL}/reservations/${token}`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.result) {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          return;
        }
        setReservations(data.reservations);
      });
  }, [token]);

  function handleSignIn(newToken: string) {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
  }

  function handleSignOut() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setReservations([]);
  }

  async function updateStatus(id: string, status: ReservationStatus) {
    const response = await fetch(`${API_URL}/reservations/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, status }),
    });
    const data = await response.json();

    if (data.result) {
      setReservations(reservations.map((reservation) => (reservation._id === id ? data.reservation : reservation)));
    }
  }

  if (!token) {
    return <AdminSignIn onSignIn={handleSignIn} />;
  }

  return (
    <section className={styles.panel}>
      <div className={styles.top}>
        <h1>Réservations</h1>
        <button className={styles.secondary} onClick={handleSignOut}>
          Se déconnecter
        </button>
      </div>

      {reservations.length === 0 && <p>Aucune réservation pour le moment.</p>}

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
    </section>
  );
}
