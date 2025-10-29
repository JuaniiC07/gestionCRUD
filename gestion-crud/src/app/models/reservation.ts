export interface Reservation {
  id?: string | number;
  movieId: string | number;
  time: string;
  name: string;
  tickets: number;
  createdAt?: string;
}
