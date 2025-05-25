import { TestBed } from "@angular/core/testing";
import { HttpClient, HttpRequest, provideHttpClient, withInterceptors } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting  } from "@angular/common/http/testing";
import { of } from "rxjs";
import { authInterceptor } from "./auth.interceptor";
import { AuthService } from "../services/auth.service";
import { RefreshResponse } from "../../features/auth/interfaces/refresh.interface";

describe('AuthInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const expiredToken = `header.${btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) - 60 }))}.signature`;
  const refreshToken = 'valid-refresh-token';
  const refreshedToken: RefreshResponse = { accessToken: 'new-access-token', refreshToken: 'new-refresh-token' };

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['refresh']);
    TestBed.configureTestingModule({ providers: [ provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting(), { provide: AuthService, useValue: authServiceSpy }] });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    
    localStorage.setItem('accessToken', expiredToken);
    localStorage.setItem('refreshToken', refreshToken);
  });

  it('should call refresh and retry request with new access token', () => {
    authServiceSpy.refresh.and.returnValue(of(refreshedToken));
    http.get('/api/test').subscribe();

    httpMock.expectOne('/api/test').flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(authServiceSpy.refresh).toHaveBeenCalledWith({ refreshToken });

    const retriedRequest = httpMock.expectOne((request: HttpRequest<any>) => request.url === '/api/test' && request.headers.get('Authorization') === `Bearer ${refreshedToken.accessToken}`);
    retriedRequest.flush({});
  });
});
