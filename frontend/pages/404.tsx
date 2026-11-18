import Head from "next/head";
import Link from "next/link";
import { useTranslation } from "@/utils/i18n";

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t.notFound.metaTitle}</title>
      </Head>
      <section style={{ padding: "6rem 2rem", textAlign: "center" }}>
        <h1>{t.notFound.title}</h1>
        <p style={{ margin: "1rem 0 2rem" }}>{t.notFound.text}</p>
        <Link href="/" style={{ textDecoration: "underline" }}>
          {t.notFound.back}
        </Link>
      </section>
    </>
  );
}
