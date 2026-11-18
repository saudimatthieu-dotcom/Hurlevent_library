import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  // No lang attribute here: with i18n routing Next.js sets it from the page's locale ("fr" or "en")
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
