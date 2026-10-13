export type OpeningHours = {
  day: string;
  open: string | null; // "10:00", or null if closed
  close: string | null;
};
