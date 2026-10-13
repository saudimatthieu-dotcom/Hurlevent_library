import Header from "@/components/Header";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <section>
          <h1>Librairie Hurlevent</h1>
          <p>238 rue de Belleville, Paris 20e</p>
        </section>

        <section>
          <h2>Rencontres & dédicaces</h2>
        </section>

        <section>
          <h2>Nos coups de cœur</h2>
        </section>

        <section>
          <h2>La librairie</h2>
        </section>

        <section>
          <h2>Infos pratiques</h2>
        </section>
      </main>

      <footer>
        <p>© Librairie Hurlevent</p>
      </footer>
    </>
  );
}
