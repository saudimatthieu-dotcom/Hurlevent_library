import Head from "next/head";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>Page introuvable — Librairie Hurlevent</title>
      </Head>
      <section style={{ padding: "6rem 2rem", textAlign: "center" }}>
        <h1>Page introuvable</h1>
        <p style={{ margin: "1rem 0 2rem" }}>Cette page n’existe pas ou a été déplacée.</p>
        <Link href="/" style={{ textDecoration: "underline" }}>
          Retour à l’accueil
        </Link>
      </section>
    </>
  );
}
