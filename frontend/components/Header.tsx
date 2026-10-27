import Link from "next/link";
import styles from "@/styles/Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        hurlevent
      </Link>
      <Link href="/livres" className={styles.orderButton}>
        Parcourir les livres
      </Link>
    </header>
  );
}
