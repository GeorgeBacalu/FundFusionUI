import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../env/env.dev';
import { apiUser } from '../../shared/constants/constants';
import { GetProfileDataResponse, UpdateProfileRequest } from '../../shared/interfaces/user/profile.interface';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = environment.baseUrl;

  private avatarUrlSubject = new BehaviorSubject<string | null>(null);
  avatarUrl$: Observable<string | null> = this.avatarUrlSubject.asObservable();
  private avatarLoadingSubject = new BehaviorSubject<boolean>(false);
  avatarLoading$: Observable<boolean> = this.avatarLoadingSubject.asObservable();

  setAvatarLoading = (isLoading: boolean): void => this.avatarLoadingSubject.next(isLoading);
  resetAvatarUrl = (): void => this.avatarUrlSubject.next(null);

  constructor(private http: HttpClient) {}

  getProfileData = (): Observable<GetProfileDataResponse> => this.http.get<GetProfileDataResponse>(`${this.baseUrl}/${apiUser}/profile`).pipe(tap(({ userSettings }) =>
    this.avatarUrlSubject.next(userSettings.avatarUrl?.split('?')[0] ? `${userSettings.avatarUrl?.split('?')[0]}?t=${Date.now()}` : null)));

  updateProfile = (payload: UpdateProfileRequest): Observable<{ message: string }> => this.http.patch<{ message: string }>(`${this.baseUrl}/${apiUser}/profile`, payload);

  uploadAvatar = (payload: FormData): Observable<{ message: string }> => this.http.post<{ message: string }>(`${this.baseUrl}/${apiUser}/profile/image`, payload);

  deleteAvatar = (): Observable<{ message: string }> => this.http.delete<{ message: string }>(`${this.baseUrl}/${apiUser}/profile/image`);
}
