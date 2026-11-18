import styles from "@/styles/About.module.css";
import { useTranslation } from "@/utils/i18n";

export default function About() {
  const { t } = useTranslation();

  return (
    <section className={styles.about}>
      <h2 className={styles.title}>{t.about.title}</h2>
      <div className={styles.text}>
        {t.about.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
