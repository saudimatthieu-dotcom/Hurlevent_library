import { useState } from "react";
import styles from "@/styles/Admin.module.css";
import { API_URL } from "@/utils/api";

type AdminSignInProps = {
  onSignIn: (token: string) => void;
};

export default function AdminSignIn({ onSignIn }: AdminSignInProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);
    const response = await fetch(`${API_URL}/admins/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (!data.result) {
      setError("Email ou mot de passe incorrect.");
      return;
    }

    onSignIn(data.token);
  }

  return (
    <form
      className={styles.signIn}
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
    >
      <h1>Espace libraire</h1>
      <label className={styles.field}>
        Email
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label className={styles.field}>
        Mot de passe
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      </label>

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" className={styles.primary}>
        Se connecter
      </button>
    </form>
  );
}
