import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../env/env.dev';
import { apiUser } from '../../shared/constants/constants';
import { GetProfileResponse, UpdateProfileRequest } from '../../shared/interfaces/user/profile.interface';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = environment.baseUrl;

  private avatarUrlSubject = new BehaviorSubject<string | null>(null);
  avatarUrl$: Observable<string | null> = this.avatarUrlSubject.asObservable();
  private avatarLoadingSubject = new BehaviorSubject<boolean>(false);
  avatarLoading$: Observable<boolean> = this.avatarLoadingSubject.asObservable();

  setAvatarLoading = (isLoading: boolean): void => this.avatarLoadingSubject.next(isLoading);
  resetAvatarUrl = (): void => this.avatarUrlSubject.next(null);
  private getCacheBustedUrl = (url: string | null): string | null => url?.split('?')[0] ? `${url.split('?')[0]}?t=${Date.now()}` : null;

  constructor(private http: HttpClient) {}

  getProfile = (): Observable<GetProfileResponse> => this.http.get<GetProfileResponse>(`${this.baseUrl}/${apiUser}/profile`).pipe(tap(({ userSettings }) => this.avatarUrlSubject.next(this.getCacheBustedUrl(userSettings?.avatarUrl ?? null))));

  updateProfile = (request: UpdateProfileRequest): Observable<{ message: string }> => this.http.patch<{ message: string }>(`${this.baseUrl}/${apiUser}/profile`, request);
  
  getAvatarUrl = (): Observable<string | null> => this.http.get(`${this.baseUrl}/${apiUser}/profile/image`, { responseType: 'text' }).pipe(tap(avatarUrl => this.avatarUrlSubject.next(this.getCacheBustedUrl(avatarUrl))));

  uploadAvatar = (request: FormData): Observable<{ message: string }> => this.http.post<{ message: string }>(`${this.baseUrl}/${apiUser}/profile/image`, request);

  deleteAvatar = (): Observable<{ message: string }> => this.http.delete<{ message: string }>(`${this.baseUrl}/${apiUser}/profile/image`);
}
