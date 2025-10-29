
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.html',
  styleUrls: ['./details.css'],
})
export class Details implements OnInit {
  movie?: Movie;

  constructor(private route: ActivatedRoute, private movieService: MovieService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) return (this.movie = undefined);

    // Try direct fetch first (works for numeric and string ids)
    this.movieService.getById(idParam).subscribe({
      next: (m) => {
        this.movie = m;
        try { this.cdr.detectChanges(); } catch {}
      },
      error: () => {
        // Fallback: fetch all and attempt to find by id (string or numeric form)
        this.movieService.getAll().subscribe({
          next: (list) => {
            const found = list.find(x => String(x.id) === idParam || (typeof x.id === 'number' && String(x.id) === idParam));
            this.movie = found;
            try { this.cdr.detectChanges(); } catch {}
          },
          error: () => {
            this.movie = undefined;
            try { this.cdr.detectChanges(); } catch {}
          }
        });
      }
    });
  }
}
