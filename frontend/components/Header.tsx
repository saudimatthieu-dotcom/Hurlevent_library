import Link from "next/link";
import styles from "@/styles/Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        hurlevent
      </Link>
      <Link href="/commander" className={styles.orderButton}>
        Commander un livre
      </Link>
    </header>
  );
}
