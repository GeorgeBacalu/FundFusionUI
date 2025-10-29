import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../env/env.dev';
import { apiAuth } from '../../shared/constants/constants';
import { RegisterRequest } from '../../features/auth/interfaces/register.interface';
import { LoginRequest, LoginResponse } from '../../features/auth/interfaces/login.interface';
import { RefreshRequest, RefreshResponse } from '../../features/auth/interfaces/refresh.interface';
import { ChangePasswordRequest } from '../../features/auth/interfaces/change-password.interface';
import { ForgotPasswordRequest } from '../../features/auth/interfaces/forgot-password.interface';
import { ResetPasswordRequest } from '../../features/auth/interfaces/reset-password.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  register = (request: RegisterRequest): Observable<{ message: string }> => this.http.post<{ message: string }>(`${this.baseUrl}/${apiAuth}/register`, request);

  login = (request: LoginRequest): Observable<LoginResponse> => this.http.post<LoginResponse>(`${this.baseUrl}/${apiAuth}/login`, request)

  refresh = (request: RefreshRequest): Observable<RefreshResponse> => this.http.post<RefreshResponse>(`${this.baseUrl}/${apiAuth}/refresh`, request)

  changePassword = (request: ChangePasswordRequest): Observable<{ message: string }> => this.http.post<{ message: string }>(`${this.baseUrl}/${apiAuth}/change-password`, request)

  forgotPassword = (request: ForgotPasswordRequest): Observable<{ message: string }> => this.http.post<{ message: string }>(`${this.baseUrl}/${apiAuth}/forgot-password`, request);

  resetPassword = (request: ResetPasswordRequest): Observable<{ message: string }> => this.http.post<{ message: string }>(`${this.baseUrl}/${apiAuth}/reset-password`, request);

  deactivateAccount = (): Observable<{ message: string }> => this.http.delete<{ message: string }>(`${this.baseUrl}/${apiAuth}`);

  logout = (): void => localStorage.clear();
}
