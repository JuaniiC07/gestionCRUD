export interface Movie {
  id?: string | number; // accept string ids from db.json and numeric ids
  title: string;
  year: number;
  director: string;
  posterUrl?: string;
}