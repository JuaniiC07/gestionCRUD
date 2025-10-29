import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReloadService {
  private reloadSubject = new Subject<void>();
  readonly reload$ = this.reloadSubject.asObservable();

  trigger() {
    this.reloadSubject.next();
  }
}
