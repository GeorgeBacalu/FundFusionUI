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

    register(payload: RegisterRequest): Observable<{ message: string }> {
      return this.http.post<{ message: string }>(`${this.baseUrl}/${apiAuth}/register`, payload);
    }

    login(payload: LoginRequest): Observable<LoginResponse> {
      return this.http.post<LoginResponse>(`${this.baseUrl}/${apiAuth}/login`, payload);
    }

    refresh(payload: RefreshRequest): Observable<RefreshResponse> {
      return this.http.post<RefreshResponse>(`${this.baseUrl}/${apiAuth}/refresh`, payload);
    }

    changePassword(payload: ChangePasswordRequest): Observable<{ message: string }> {
      return this.http.post<{ message: string }>(`${this.baseUrl}/${apiAuth}/change-password`, payload);
    }

    forgotPassword(payload: ForgotPasswordRequest): Observable<{ message: string }> {
      return this.http.post<{ message: string }>(`${this.baseUrl}/${apiAuth}/forgot-password`, payload);
    }

    resetPassword(payload: ResetPasswordRequest): Observable<{ message: string }> {
      return this.http.post<{ message: string }>(`${this.baseUrl}/${apiAuth}/reset-password`, payload);
    }

    logout = () => (localStorage.removeItem('accessToken'), localStorage.removeItem('refreshToken'));
}