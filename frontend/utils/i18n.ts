import { useRouter } from "next/router";
import { fr, type Dictionary } from "@/locales/fr";
import { en } from "@/locales/en";

const dictionaries = { fr, en };

export type Locale = keyof typeof dictionaries;

// Next.js puts the locale in the URL ("/" → fr, "/en" → en); this hook returns the matching dictionary
export function useTranslation(): { t: Dictionary; locale: Locale } {
  const { locale } = useRouter();
  const current: Locale = locale === "en" ? "en" : "fr";
  return { t: dictionaries[current], locale: current };
}
