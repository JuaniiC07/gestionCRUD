
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-form-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-edit.html',
  styleUrls: ['./form-edit.css'],
})
export class FormEdit implements OnInit {
  form!: FormGroup;
  id?: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      year: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      director: ['', [Validators.required, Validators.minLength(2)]]
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam ? Number(idParam) : undefined;
    if (this.id) {
      this.movieService.getById(this.id).subscribe(m => {
        this.form.patchValue({
          title: m.title,
          year: m.year,
          director: m.director
        });
      });
    }
  }

  submit() {
    if (this.form.invalid || !this.id) return;
    const movie: Movie = this.form.value;
    movie.year = Number(movie.year);
    this.movieService.update(this.id, movie).subscribe(() => this.router.navigate(['/list']));
  }
}
