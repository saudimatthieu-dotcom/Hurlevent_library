import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Events from "@/components/Events";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />

        <Events />

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
