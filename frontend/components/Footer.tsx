import styles from "@/styles/Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p className={styles.logo}>hurlevent</p>
      <p>238 rue de Belleville, 75020 Paris</p>
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
