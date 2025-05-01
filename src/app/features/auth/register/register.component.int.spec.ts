import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { provideRouter, Router } from "@angular/router";
import { RegisterComponent } from "./register.component"
import { LoginComponent } from "../login/login.component";
import { MessageService } from "primeng/api";
import { environment } from "../../../../env/env.dev";
import { apiAuth, userRegisteredSuccessfully } from "../../../shared/constants/constants";
import { registerRequest } from "../../../shared/mocks/user.mock";

describe('RegisterComponent Integration', () => {
  let fixture: ComponentFixture<RegisterComponent>;
  let component: RegisterComponent;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([{ path: 'login', component: LoginComponent }]), MessageService]
    }).compileComponents();
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  it('should register successfully and navigate', fakeAsync(() => {
    component.registerForm.setValue(registerRequest);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button[type="submit"]').click();
    tick();

    const testRequest = httpMock.expectOne(`${environment.baseUrl}/${apiAuth}/register`);
    testRequest.flush({ message: userRegisteredSuccessfully });
    tick();

    expect(testRequest.request.method).toBe('POST');
    expect(testRequest.request.body).toEqual(registerRequest);
    expect(router.url).toBe('/login');
  }));

  [{ field: 'name', title: 'Duplicated name', detail: 'This name is already taken' },
   { field: 'email', title: 'Duplicated email', detail: 'This email is already taken' },
   { field: 'phone', title: 'Duplicated phone', detail: 'This phone is already taken' }].forEach(({ field, title, detail }) => {
    it(`should show error toast if ${field} is already taken`, fakeAsync(() => {
      component.registerForm.setValue(registerRequest);
      fixture.detectChanges();

      fixture.nativeElement.querySelector('button[type="submit"]').click();
      tick();

      const testRequest = httpMock.expectOne(`${environment.baseUrl}/${apiAuth}/register`);
      testRequest.flush({ title, detail }, { status: 409, statusText: 'Conflict' });
      tick();

      expect(testRequest.request.method).toBe('POST');
      expect(testRequest.request.body).toEqual(registerRequest);
      expect(router.url).not.toBe('/login');
      }));
    });
})