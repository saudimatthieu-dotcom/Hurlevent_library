import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Events from "@/components/Events";
import Picks from "@/components/Picks";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />

        <Events />

        <Picks />

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
