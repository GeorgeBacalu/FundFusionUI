import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { AuthService } from "./auth.service";
import { environment } from "../../../env/env.dev";
import { apiAuth } from "../../shared/constants/constants";
import { loginRequest, registerRequest } from "../../shared/mocks/user.mock";

describe('AuthService', () => {
  let authService: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), AuthService] }).compileComponents();
    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should call the register endpoint', () => {
    authService.register(registerRequest).subscribe();
    const testRequest = httpMock.expectOne(`${environment.baseUrl}/${apiAuth}/register`);
    
    expect(testRequest.request.method).toBe('POST');
    expect(testRequest.request.body).toEqual(registerRequest);
    testRequest.flush({});
  });

  it('should call the login endpoint', () => {
    authService.login(loginRequest).subscribe();
    const testRequest = httpMock.expectOne(`${environment.baseUrl}/${apiAuth}/login`);
    
    expect(testRequest.request.method).toBe('POST');
    expect(testRequest.request.body).toEqual(loginRequest);
    testRequest.flush({});
  });
});