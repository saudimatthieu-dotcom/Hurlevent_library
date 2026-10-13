import Header from "@/components/Header";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />

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
