import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../env/env.dev';
import { apiAuth } from '../../shared/constants/constants';
import { RegisterRequest } from '../../features/auth/interfaces/register.interface';
import { LoginRequest, LoginResponse } from '../../features/auth/interfaces/login.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly baseUrl = environment.baseUrl;

    constructor(private http: HttpClient) {}

    public register(payload: RegisterRequest): Observable<{ message: string }> {
      return this.http.post<{ message: string }>(`${this.baseUrl}/${apiAuth}/register`, payload);
    }

    public login(payload: LoginRequest): Observable<LoginResponse> {
      return this.http.post<LoginResponse>(`${this.baseUrl}/${apiAuth}/login`, payload);
    }
}