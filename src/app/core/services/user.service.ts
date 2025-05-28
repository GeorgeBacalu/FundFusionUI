import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../env/env.dev';
import { apiUser } from '../../shared/constants/constants';
import { GetProfileDataResponse } from '../../shared/interfaces/user/profile-data.interface';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getProfileData = (): Observable<GetProfileDataResponse> => this.http.get<GetProfileDataResponse>(`${this.baseUrl}/${apiUser}/profile`);
}
