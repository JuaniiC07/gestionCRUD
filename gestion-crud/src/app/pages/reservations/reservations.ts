import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../services/reservation.service';
import { MovieService } from '../../services/movie.service';
import { Reservation } from '../../models/reservation';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservations.html',
  styleUrls: ['./reservations.css']
})
export class Reservations implements OnInit {
  reservations: Array<Reservation & { movieTitle?: string }> = [];
  movies: Movie[] = [];
  // filtering & paging
  selectedMovieId: string | '' = '';
  page = 1;
  pageSize = 10;

  constructor(
    private reservationService: ReservationService,
    private movieService: MovieService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // load movies first to map ids to titles
    this.movieService.getAll().subscribe({
      next: (m) => {
        this.movies = m;
        this.loadReservations();
      },
      error: () => {
        this.movies = [];
        this.loadReservations();
      }
    });
  }

  loadReservations() {
    this.reservationService.getAll().subscribe({
      next: (list) => {
        this.reservations = list.map(r => ({
          ...r,
          movieTitle: this.movies.find(m => String(m.id) === String(r.movieId))?.title
        }));
        try { this.cdr.detectChanges(); } catch {}
      },
      error: () => {
        this.reservations = [];
        try { this.cdr.detectChanges(); } catch {}
      }
    });
  }

  get filtered() {
    if (!this.selectedMovieId) return this.reservations;
    return this.reservations.filter(r => String(r.movieId) === String(this.selectedMovieId));
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this.filtered.length / this.pageSize));
  }

  get paged() {
    const start = (this.page - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  changePage(dir: number) {
    this.page = Math.min(this.totalPages, Math.max(1, this.page + dir));
  }

  deleteReservation(id?: string | number) {
    if (!id) return;
    if (!confirm('Eliminar reserva?')) return;
    this.reservationService.delete(id).subscribe({ next: () => { this.loadReservations(); }, error: () => { alert('Error al eliminar'); } });
  }

  posterFor(r: Reservation) {
    const m = this.movies.find(m => String(m.id) === String(r.movieId));
    const url = m?.posterUrl ? m.posterUrl : `https://picsum.photos/seed/${r.movieId}/80/120`;
    return `url(${url})`;
  }
}
