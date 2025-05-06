import { inject } from '@angular/core';
import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, from, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { apiAuth } from '../../shared/constants/constants';

export const authInterceptor: HttpInterceptorFn = (request: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);

  if (request.url.endsWith(`/${apiAuth}/refresh`)) return next(request);

  const accessToken = localStorage.getItem('accessToken');
  const authRequest = accessToken ? request.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } }) : request;

  return next(authRequest).pipe(catchError((error: HttpErrorResponse) => {
    if (error.status !== 401) return throwError(() => error);
    
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return logoutAndThrow(error);

    return from(authService.refresh({ refreshToken })).pipe(switchMap(({ accessToken, refreshToken }) => {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      const retriedRequest = request.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } });
      return next(retriedRequest);
    }), catchError(logoutAndThrow));
  }));
};

function logoutAndThrow(error: any): Observable<never> {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  return throwError(() => error);
}