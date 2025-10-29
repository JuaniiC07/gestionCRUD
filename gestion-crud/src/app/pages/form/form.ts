
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrls: ['./form.css'],
})
export class Form implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private movieService: MovieService, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      year: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      director: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  submit() {
    if (this.form.invalid) return;
    const movie: Movie = this.form.value;
    movie.year = Number(movie.year);
    this.movieService.create(movie).subscribe(() => this.router.navigate(['/list']));
  }
}
