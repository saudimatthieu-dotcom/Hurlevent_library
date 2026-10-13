import Head from "next/head";
// "@/" = the root of frontend/ (alias defined in tsconfig.json → "paths")
import Home from "@/components/Home";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Librairie Hurlevent — Belleville, Paris 20e</title>
        <meta
          name="description"
          content="Librairie indépendante au 238 rue de Belleville, Paris 20e. Rencontres, dédicaces, coups de cœur et commande en ligne avec retrait en librairie."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Home />
    </>
  );
}
