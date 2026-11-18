import Image from "next/image";
import styles from "@/styles/Hero.module.css";
import { useEffect, useState } from "react";
import { getOpenStatus, type OpenStatus } from "@/utils/openStatus";
import { useTranslation } from "@/utils/i18n";

export default function Hero() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<OpenStatus | null>(null);

  useEffect(() => {
    const update = () => setStatus(getOpenStatus(new Date(), t));
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, [t]);

  return (
    <section className={styles.hero}>
      <Image
        src="/images/shop-local-test.jpg"
        alt={t.hero.alt}
        fill
        sizes="100vw"
        priority
        className={styles.photo}
      />
      <div className={styles.content}>
        <h1 className={styles.title}>{t.hero.title}</h1>
        <p className={styles.tagline}>{t.hero.tagline}</p>
        <p>238 rue de Belleville · {t.metro}</p>
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
          {t.hero.directions}
        </a>
      </div>
    </section>
  );
}
