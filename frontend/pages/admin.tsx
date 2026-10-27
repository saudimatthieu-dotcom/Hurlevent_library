import Head from "next/head";
import dynamic from "next/dynamic";

const AdminPanel = dynamic(() => import("@/components/AdminPanel"), { ssr: false });

export default function AdminPage() {
  return (
    <>
      <Head>
        <title>Espace libraire — Librairie Hurlevent</title>
        <meta name="robots" content="noindex" />
      </Head>
      <AdminPanel />
    </>
  );
}
