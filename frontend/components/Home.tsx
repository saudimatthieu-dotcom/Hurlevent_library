import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Events from "@/components/Events";
import Picks from "@/components/Picks";
import PracticalInfo from "@/components/PracticalInfo";

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

        <PracticalInfo />
      </main>

      <footer>
        <p>© Librairie Hurlevent</p>
      </footer>
    </>
  );
}
