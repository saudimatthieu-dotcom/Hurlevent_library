// One entry per day, Monday first; the day names come from the dictionaries (locales/)
export type OpeningHours = {
  open: string | null; // "10:00", or null if closed
  close: string | null;
};
