import { Injectable } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private activeRequests: number = 0;
  private activeRoutes: number = 0;
  private _loading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  loading: Observable<boolean> = this._loading.asObservable();

  constructor(router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) this.activeRoutes++;
      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) this.activeRoutes = Math.max(this.activeRoutes - 1, 0);
      this.update();
    });
  }

  show = (): void => (this.activeRequests++, this.update());

  hide = (): void => (this.activeRequests = Math.max(this.activeRequests - 1, 0), this.update());

  private update = (): void => this._loading.next(this.activeRequests > 0 || this.activeRoutes > 0);
}