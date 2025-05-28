import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../env/env.dev';
import { apiUser } from '../../shared/constants/constants';
import { GetProfileInfoResponse } from '../../shared/interfaces/user/profile-info.interface';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getProfileInfo = (): Observable<GetProfileInfoResponse> => this.http.get<GetProfileInfoResponse>(`${this.baseUrl}/${apiUser}/profile`);
}
