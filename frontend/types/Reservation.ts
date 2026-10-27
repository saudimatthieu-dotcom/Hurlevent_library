export type ReservationStatus = "pending" | "ready" | "collected" | "cancelled";

export type Reservation = {
  _id: string;
  isbn: string;
  title: string;
  author: string;
  customerName: string;
  phone: string;
  email?: string;
  status: ReservationStatus;
  createdAt: string;
};
