import Link from "next/link";
import { useRouter } from "next/router";
import styles from "@/styles/Header.module.css";
import { useTranslation } from "@/utils/i18n";

export default function Header() {
  const { t, locale } = useTranslation();
  const { asPath } = useRouter();
  const otherLocale = locale === "fr" ? "en" : "fr";

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        hurlevent
      </Link>
      <nav className={styles.actions}>
        <Link href="/livres" className={styles.orderButton}>
          {t.header.browse}
        </Link>
        {/* Same page, other language: the locale prop swaps the "/en" prefix */}
        <Link
          href={asPath}
          locale={otherLocale}
          className={styles.languageButton}
          lang={otherLocale}
          aria-label={t.header.otherLanguageLabel}
        >
          {t.header.otherLanguage}
        </Link>
      </nav>
    </header>
  );
}
