import Image from "next/image";
import styles from "@/styles/Hero.module.css";

export default function Hero() {
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
        <a
          href="https://www.google.com/maps/search/?api=1&query=238+rue+de+Belleville+75020+Paris"
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
