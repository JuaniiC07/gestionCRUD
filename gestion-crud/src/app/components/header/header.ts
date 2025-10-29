import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ReloadService } from '../../services/reload.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {
  constructor(private router: Router, private reload: ReloadService) {}

  goList(ev: Event) {
    ev.preventDefault();
    // Navigate to /list then trigger a reload shortly after so the List component can fetch data.
    this.router.navigate(['/list']).then(() => {
      // small delay to allow the lazy component to initialize and subscribe
      setTimeout(() => this.reload.trigger(), 40);
    });
  }
}
