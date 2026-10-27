import Head from "next/head";
import type { GetServerSideProps } from "next";
// "@/" = the root of frontend/ (alias defined in tsconfig.json → "paths")
import Home from "@/components/Home";
import type { ShopEvent } from "@/types/ShopEvent";
import type { Pick } from "@/types/Book";
import { apiRequest } from "@/utils/api";

type HomePageProps = {
  events: ShopEvent[];
  picks: Pick[];
};

export const getServerSideProps: GetServerSideProps<HomePageProps> = async () => {
  const [eventsData, picksData] = await Promise.all([
    apiRequest<{ events: ShopEvent[] }>("/events"),
    apiRequest<{ picks: Pick[] }>("/picks"),
  ]);

  return {
    props: {
      events: eventsData?.result ? eventsData.events : [],
      picks: picksData?.result ? picksData.picks : [],
    },
  };
};

export default function HomePage({ events, picks }: HomePageProps) {
  return (
    <>
      <Head>
        <title>Librairie Hurlevent — Belleville, Paris 20e</title>
        <meta
          name="description"
          content="Librairie indépendante au 238 rue de Belleville, Paris 20e. Rencontres, dédicaces, coups de cœur et réservation en ligne avec retrait en librairie."
        />
      </Head>
      <Home events={events} picks={picks} />
    </>
  );
}
