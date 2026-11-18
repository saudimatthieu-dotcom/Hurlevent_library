import styles from "@/styles/Footer.module.css";
import { useTranslation } from "@/utils/i18n";

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p className={styles.logo}>hurlevent</p>
      <p>{t.address}</p>
      <a
        href="https://www.instagram.com/librairie_hurlevent/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Instagram
      </a>
      <p className={styles.copyright}>© {year} Librairie Hurlevent</p>
    </footer>
  );
}
