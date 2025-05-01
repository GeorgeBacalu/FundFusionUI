import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { provideRouter, Router } from "@angular/router";
import { LoginComponent } from "./login.component";
import { HomeComponent } from "../../home/home.component";
import { MessageService } from "primeng/api";
import { environment } from "../../../../env/env.dev";
import { apiAuth } from "../../../shared/constants/constants";
import { loginRequest } from "../../../shared/mocks/user.mock";
import { accountNotFound, invalidCredentials } from "../../../shared/constants/constants";

describe('LoginComponent Integration', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([{ path: '', component: HomeComponent }]), MessageService]
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  })

  it('should login successfully and navigate', fakeAsync(() => {
    component.loginForm.setValue(loginRequest);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button[type="submit"]').click();
    tick();

    const testRequest = httpMock.expectOne(`${environment.baseUrl}/${apiAuth}/login`);
    testRequest.flush({});
    tick();

    expect(testRequest.request.method).toBe('POST');
    expect(testRequest.request.body).toEqual(loginRequest);
    expect(router.url).toBe('/');
  }));

  [{ status: 404, statusText: 'Not Found', field: 'email', title: 'Login failed', detail: accountNotFound },
   { status: 400, statusText: 'Bad Request', field: 'password', title: 'Login failed', detail: invalidCredentials }].forEach(({ status, statusText, field, title, detail }) => {
    it(`should fail login if ${field} is incorrect`, fakeAsync(() => {
      spyOn(router, 'navigate');
  
      component.loginForm.setValue(loginRequest);
      fixture.detectChanges();
  
      fixture.nativeElement.querySelector('button[type="submit"]').click();
      tick();
  
      const testRequest = httpMock.expectOne(`${environment.baseUrl}/${apiAuth}/login`);
      testRequest.flush({ title, detail }, { status, statusText });
      tick();
  
      expect(testRequest.request.method).toBe('POST');
      expect(testRequest.request.body).toEqual(loginRequest);
      expect(router.navigate).not.toHaveBeenCalled();
    }));
  });
});