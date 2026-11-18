import { openingHours } from "@/data/openingHours";
import type { Dictionary } from "@/locales/fr";

export type OpenStatus = {
  isOpen: boolean;
  label: string;
};

export function getOpenStatus(now: Date, t: Dictionary): OpenStatus {
  const dayIndex = (now.getDay() + 6) % 7; // JS: 0 = Sunday → our array starts on Monday
  const today = openingHours[dayIndex];

  if (!today.open || !today.close) {
    return { isOpen: false, label: t.openStatus.closedToday };
  }

  const time = now.toTimeString().slice(0, 5); // "14:35"

  if (time >= today.open && time < today.close) {
    return { isOpen: true, label: t.openStatus.opensUntil(t.time(today.close)) };
  }

  return { isOpen: false, label: t.openStatus.closedNow };
}
