import type { OpeningHours } from "@/types/OpeningHours";

// Monday first. Source: Google Maps listing + Instagram post (Monday now closes at 19h), checked 2026-10-13
export const openingHours: OpeningHours[] = [
  { open: "14:00", close: "19:00" }, // Monday
  { open: "10:00", close: "20:00" },
  { open: "10:00", close: "20:00" },
  { open: "10:00", close: "20:00" },
  { open: "10:00", close: "20:00" },
  { open: "10:00", close: "20:00" },
  { open: null, close: null }, // Sunday
];
