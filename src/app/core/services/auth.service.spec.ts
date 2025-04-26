import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { AuthService } from "./auth.service";
import { environment } from "../../../env/env.dev";
import { apiAuth } from "../../shared/constants/constants";
import { registerRequest } from "../../shared/mocks/user.mock";

describe('AuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), AuthService] }));

  it('should call the register endpoint', () => {
    const authService = TestBed.inject(AuthService);
    const httpMock = TestBed.inject(HttpTestingController);
    
    authService.register(registerRequest).subscribe();
    const testRequest = httpMock.expectOne(`${environment.baseUrl}/${apiAuth}/register`);
    
    expect(testRequest.request.method).toBe('POST');
    expect(testRequest.request.body).toEqual(registerRequest);
    testRequest.flush({});
  });
});