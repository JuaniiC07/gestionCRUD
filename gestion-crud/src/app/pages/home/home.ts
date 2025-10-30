
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit {
  featured: Movie[] = [];

  // sample trailer IDs for embedding (placeholders)
  trailers: Array<{ id: string; title: string; safeUrl?: SafeResourceUrl }> = [
    { id: 'm8e-FF8MsqU', title: 'Trailer 1' },
    { id: 'YoHD9XEInc0', title: 'Trailer 2' },
    { id: '8hP9D6kZseM', title: 'Trailer 3' }
  ];

  constructor(
    private movieService: MovieService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    // fetch featured
    this.movieService.getAll().subscribe({
      next: (m) => {
        this.featured = m.slice(0, 4);
        try {
          this.cdr.detectChanges();
        } catch {}
      },
      error: () => {
        this.featured = [];
        try {
          this.cdr.detectChanges();
        } catch {}
      },
    });

    // prepare sanitized safe URLs for trailers to avoid NG0904
    for (const t of this.trailers) {
      const url = `https://www.youtube.com/embed/${t.id}`;
      try {
        t.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      } catch {
        // fallback: leave undefined so template can avoid binding unsafe value
        t.safeUrl = undefined;
      }
    }
  }

  // id of currently embedded trailer (lazy embed)
  embeddedTrailerId?: string;

  embedTrailer(t: { id: string; safeUrl?: SafeResourceUrl }) {
    if (!t || !t.safeUrl) return;
    this.embeddedTrailerId = t.id;
    try { this.cdr.detectChanges(); } catch {}
  }

  closeEmbed() {
    this.embeddedTrailerId = undefined;
    try { this.cdr.detectChanges(); } catch {}
  }
}
