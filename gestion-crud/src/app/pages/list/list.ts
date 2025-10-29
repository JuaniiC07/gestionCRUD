import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie';
import { filter, Subject, takeUntil } from 'rxjs';
import { NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list.html',
  styleUrls: ['./list.css'],
})
export class List implements OnInit, OnDestroy {
  movies: Movie[] = [];
  private destroy$ = new Subject<void>();

  constructor(private movieService: MovieService, private router: Router) {}

  ngOnInit(): void {
    // initial load
    this.load();

    // reload when navigation ends and the current url matches /list
    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((e: any) => {
        if (e.urlAfterRedirects && e.urlAfterRedirects.startsWith('/list')) {
          this.load();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load() {
    this.movieService.getAll().subscribe({ next: m => this.movies = m, error: () => this.movies = [] });
  }

  goToDetails(id?: number) {
    if (id == null) return;
    this.router.navigate(['/details', id]);
  }

  goToEdit(id?: number) {
    if (id == null) return;
    this.router.navigate(['/form-edit', id]);
  }

  delete(id?: number) {
    if (id == null) return;
    if (!confirm('¿Eliminar este registro?')) return;
    this.movieService.delete(id).subscribe(() => this.load());
  }
}
