import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../env/env.dev';
import { apiUser } from '../../shared/constants/constants';
import { GetProfileDataResponse, UpdateProfileRequest } from '../../shared/interfaces/user/profile.interface';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = environment.baseUrl;

  private avatarUrlSubject = new BehaviorSubject<string | null>(localStorage.getItem('avatarUrl'));
  avatarUrl$: Observable<string | null> = this.avatarUrlSubject.asObservable();

  constructor(private http: HttpClient) {}

  getProfileData = (): Observable<GetProfileDataResponse> => this.http.get<GetProfileDataResponse>(`${this.baseUrl}/${apiUser}/profile`).pipe(tap(({ userSettings }) => {
    const baseAvatarUrl = userSettings.avatarUrl?.split('?')[0], timestampedUrl = baseAvatarUrl ? `${baseAvatarUrl}?t=${Date.now()}` : '';
    localStorage.setItem('avatarUrl', timestampedUrl), this.avatarUrlSubject.next(baseAvatarUrl ? timestampedUrl : null);
  }));

  updateProfile = (payload: UpdateProfileRequest): Observable<{ message: string }> => this.http.patch<{ message: string }>(`${this.baseUrl}/${apiUser}/profile`, payload);

  uploadAvatar = (payload: FormData): Observable<{ message: string }> => this.http.post<{ message: string }>(`${this.baseUrl}/${apiUser}/profile/image/upload`, payload);
}
