import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie';
import { MovieService } from '../services/movie.service';

@Injectable({ providedIn: 'root' })
export class MoviesResolver implements Resolve<Movie[]>
{
  constructor(private movieService: MovieService) {}

  resolve(): Observable<Movie[]> {
    return this.movieService.getAll();
  }
}
