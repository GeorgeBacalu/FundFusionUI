import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../env/env.dev';
import { apiUser } from '../../shared/constants/constants';
import { GetProfileDataResponse, UpdateProfileRequest } from '../../shared/interfaces/user/profile.interface';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getProfileData = (): Observable<GetProfileDataResponse> => this.http.get<GetProfileDataResponse>(`${this.baseUrl}/${apiUser}/profile`);

  updateProfile = (payload: UpdateProfileRequest): Observable<{ message: string }> => this.http.patch<{ message: string }>(`${this.baseUrl}/${apiUser}/profile`, payload);
}
