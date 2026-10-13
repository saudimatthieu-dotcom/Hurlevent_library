import type { OpeningHours } from "@/types/OpeningHours";

// Source: Google Maps listing + Instagram post (Monday now closes at 19h), checked 2026-10-13
export const openingHours: OpeningHours[] = [
  { day: "Lundi", open: "14:00", close: "19:00" },
  { day: "Mardi", open: "10:00", close: "20:00" },
  { day: "Mercredi", open: "10:00", close: "20:00" },
  { day: "Jeudi", open: "10:00", close: "20:00" },
  { day: "Vendredi", open: "10:00", close: "20:00" },
  { day: "Samedi", open: "10:00", close: "20:00" },
  { day: "Dimanche", open: null, close: null },
];
