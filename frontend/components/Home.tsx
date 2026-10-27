import Hero from "@/components/Hero";
import Events from "@/components/Events";
import Picks from "@/components/Picks";
import About from "@/components/About";
import PracticalInfo from "@/components/PracticalInfo";
import type { ShopEvent } from "@/types/ShopEvent";
import type { Pick } from "@/types/Book";

type HomeProps = {
  events: ShopEvent[];
  picks: Pick[];
};

export default function Home({ events, picks }: HomeProps) {
  return (
    <>
      <Hero />
      <Events events={events} />
      <Picks picks={picks} />
      <About />
      <PracticalInfo />
    </>
  );
}
