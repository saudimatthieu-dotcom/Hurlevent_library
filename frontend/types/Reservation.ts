export type ReservationStatus = "pending" | "ready" | "collected" | "cancelled";

export type Reservation = {
  // Mongo: _id: string;
  id: number;
  isbn: string;
  title: string;
  author: string;
  customerName: string;
  phone: string;
  // Mongo: email?: string;
  email?: string | null; // Postgres sends null when the customer gave no email
  status: ReservationStatus;
  createdAt: string;
};
