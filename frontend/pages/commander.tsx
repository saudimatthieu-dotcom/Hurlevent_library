import Head from "next/head";

export default function OrderPage() {
  return (
    <>
      <Head>
        <title>Commander un livre — Librairie Hurlevent</title>
      </Head>
      <section style={{ padding: "4rem 2rem" }}>
        <h1>Commander un livre</h1>
        <p>
          Cherchez un livre, réservez-le en ligne et venez le retirer en
          librairie. Le paiement se fait sur place.
        </p>
      </section>
    </>
  );
}
