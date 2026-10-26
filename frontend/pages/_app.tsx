import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Layout from "@/components/Layout";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-serif",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${serif.variable} ${sans.className}`}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  );
}

