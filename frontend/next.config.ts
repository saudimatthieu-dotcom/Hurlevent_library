import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // "/" stays French, "/en" is the English version of every page
  i18n: {
    locales: ["fr", "en"],
    defaultLocale: "fr",
    // Always open in French: no automatic redirect to /en from the browser's language
    localeDetection: false,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "covers.openlibrary.org" },
      { protocol: "https", hostname: "books.google.com" },
    ],
  },
};

export default nextConfig;
