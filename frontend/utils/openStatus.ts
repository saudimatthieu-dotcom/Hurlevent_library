import { openingHours } from "@/data/openingHours";

export type OpenStatus = {
  isOpen: boolean;
  label: string;
};

export function getOpenStatus(now: Date): OpenStatus {
  const dayIndex = (now.getDay() + 6) % 7; // JS: 0 = Sunday → our array starts on Monday
  const today = openingHours[dayIndex];

  if (!today.open || !today.close) {
    return { isOpen: false, label: "Fermé aujourd’hui" };
  }

  const time = now.toTimeString().slice(0, 5); // "14:35"

  if (time >= today.open && time < today.close) {
    return { isOpen: true, label: `Ouvert · ferme à ${today.close.replace(":", "h")}` };
  }

  return { isOpen: false, label: "Fermé en ce moment" };
}
