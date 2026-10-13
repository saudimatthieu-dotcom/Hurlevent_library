import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Events from "@/components/Events";
import Picks from "@/components/Picks";
import About from "@/components/About";
import PracticalInfo from "@/components/PracticalInfo";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />

        <Events />

        <Picks />

        <About />

        <PracticalInfo />
      </main>

      <Footer />
    </>
  );
}
