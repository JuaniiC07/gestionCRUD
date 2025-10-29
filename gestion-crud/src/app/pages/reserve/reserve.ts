import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { ReservationService } from '../../services/reservation.service';
import { Movie } from '../../models/movie';
import { Reservation } from '../../models/reservation';

@Component({
  selector: 'app-reserve',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reserve.html',
  styleUrls: ['./reserve.css']
})
export class Reserve implements OnInit {
  movie?: Movie;
  times: string[] = [];
  form!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private reservationService: ReservationService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      tickets: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      time: ['', Validators.required]
    });
    this.movieService.getById(id).subscribe({ next: m => { this.movie = m; this.times = this.generateTimes(m); }, error: () => {
      // fallback: find in list
      this.movieService.getAll().subscribe(list => {
        this.movie = list.find(x => String(x.id) === id);
        if (this.movie) this.times = this.generateTimes(this.movie);
      });
    } });
  }

  generateTimes(m: Movie) {
    // simple times generator: three showtimes
    return ['13:00', '16:30', '19:45'];
  }

  submit() {
    if (this.form.invalid || !this.movie) return;
    const payload: Reservation = {
      movieId: this.movie.id as string | number,
      time: String(this.form.value.time),
      name: String(this.form.value.name),
      tickets: Number(this.form.value.tickets)
    };
    this.reservationService.create(payload).subscribe(() => {
      alert('Reserva creada correctamente');
      this.router.navigate(['/list']);
    });
  }
}
