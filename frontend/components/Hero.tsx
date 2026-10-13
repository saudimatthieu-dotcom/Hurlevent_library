import Image from "next/image";
import styles from "@/styles/Hero.module.css";
import { useEffect, useState } from "react";
import { getOpenStatus, type OpenStatus } from "@/utils/openStatus";

export default function Hero() {
  const [status, setStatus] = useState<OpenStatus | null>(null);

  useEffect(() => {
    const update = () => setStatus(getOpenStatus(new Date()));
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className={styles.hero}>
      <Image
        src="/images/shop-local-test.jpg"
        alt="Les rayonnages de la librairie Hurlevent"
        fill
        sizes="100vw"
        priority
        className={styles.photo}
      />
      <div className={styles.content}>
        <h1 className={styles.title}>Librairie Hurlevent</h1>
        <p className={styles.tagline}>Librairie indépendante · Paris 20e</p>
        <p>238 rue de Belleville · Métro Télégraphe (ligne 11)</p>
        {status && (
          <p className={status.isOpen ? styles.open : styles.closed}>
            {status.label}
          </p>
        )}
        <a
          href="https://www.google.com/maps/search/?api=1&query=Librairie+Hurlevent+238+rue+de+Belleville+Paris"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.mapLink}
        >
          Voir l’itinéraire
        </a>
      </div>
    </section>
  );
}
