import { useCallback, useState } from "react";
import AdminSignIn from "@/components/AdminSignIn";
import AdminReservations from "@/components/AdminReservations";
import AdminEvents from "@/components/AdminEvents";
import AdminPicks from "@/components/AdminPicks";
import AdminCatalog from "@/components/AdminCatalog";
import styles from "@/styles/Admin.module.css";

const TOKEN_KEY = "adminToken";

type AdminTab = "reservations" | "events" | "picks" | "catalog";

const TABS: { value: AdminTab; label: string }[] = [
  { value: "reservations", label: "Réservations" },
  { value: "events", label: "Rencontres" },
  { value: "picks", label: "Coups de cœur" },
  { value: "catalog", label: "Catalogue" },
];

export default function AdminPanel() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [tab, setTab] = useState<AdminTab>("reservations");

  function handleSignIn(newToken: string) {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
  }

  const handleSignOut = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  if (!token) {
    return <AdminSignIn onSignIn={handleSignIn} />;
  }

  const tabProps = { token, onUnauthorized: handleSignOut };

  return (
    <section className={styles.panel}>
      <div className={styles.top}>
        <h1>Espace libraire</h1>
        <button className={styles.secondary} onClick={handleSignOut}>
          Se déconnecter
        </button>
      </div>

      <nav className={styles.tabs}>
        {TABS.map((item) => (
          <button
            key={item.value}
            className={item.value === tab ? `${styles.tab} ${styles.activeTab}` : styles.tab}
            onClick={() => setTab(item.value)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {tab === "reservations" && <AdminReservations {...tabProps} />}
      {tab === "events" && <AdminEvents {...tabProps} />}
      {tab === "picks" && <AdminPicks {...tabProps} />}
      {tab === "catalog" && <AdminCatalog {...tabProps} />}
    </section>
  );
}
