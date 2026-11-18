import Head from "next/head";
import type { GetServerSideProps } from "next";
// "@/" = the root of frontend/ (alias defined in tsconfig.json → "paths")
import Home from "@/components/Home";
import type { ShopEvent } from "@/types/ShopEvent";
import type { Pick } from "@/types/Book";
import { apiRequest } from "@/utils/api";
import { useTranslation } from "@/utils/i18n";

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
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t.home.metaTitle}</title>
        <meta name="description" content={t.home.metaDescription} />
      </Head>
      <Home events={events} picks={picks} />
    </>
  );
}
