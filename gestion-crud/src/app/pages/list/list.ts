import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie';
import { filter, Subject, takeUntil } from 'rxjs';
import { NavigationEnd, ActivationEnd } from '@angular/router';
import { ReloadService } from '../../services/reload.service';

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

  constructor(
    private movieService: MovieService,
    private router: Router,
    private reload: ReloadService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // prefer resolved data (if available) so the list is populated immediately on navigation
    const resolved = this.route.snapshot.data['movies'] as Movie[] | undefined;
    if (resolved && Array.isArray(resolved)) {
      this.movies = resolved;
      // ensure view updates when using zoneless change detection
      try { this.cdr.detectChanges(); } catch { }
    } else {
      // fallback: initial load
      this.load();
    }

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

    // Also listen for ActivationEnd which fires when a route (and its component) is activated.
    // This ensures we reload after lazy component activation when navigating from other pages.
    this.router.events
      .pipe(
        filter(e => e instanceof ActivationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((e: any) => {
        try {
          const path = e.snapshot.routeConfig && e.snapshot.routeConfig.path;
          if (path === 'list' || (e.snapshot && e.snapshot.url && e.snapshot.url.join('/') === 'list')) {
            this.load();
          }
        } catch (err) {
          // swallow any unexpected snapshot shapes
        }
      });

    // reload when header requests it (guarantees a fresh fetch when clicking the header)
    this.reload.reload$.pipe(takeUntil(this.destroy$)).subscribe(() => this.load());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load() {
    this.movieService.getAll().subscribe({ next: m => { this.movies = m; try { this.cdr.detectChanges(); } catch {} }, error: (err) => { this.movies = []; try { this.cdr.detectChanges(); } catch {} } });
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
