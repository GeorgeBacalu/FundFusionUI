import { TestBed } from "@angular/core/testing";
import { FormGroup } from "@angular/forms";
import { provideRouter, Router } from "@angular/router";
import { of, throwError } from "rxjs";
import { LoginComponent } from "./login.component"
import { AuthService } from "../../../core/services/auth.service";
import { MessageService } from "primeng/api";
import { loginRequest } from "../../../shared/mocks/user.mock";
import { accountNotFound, genericError, invalidCredentials, userLoggedInSuccessfully } from "../../../shared/constants/constants";

describe('LoginComponent', () => {
  let component: LoginComponent;
  let form: FormGroup['controls'];
  let authService: jasmine.SpyObj<AuthService>;
  let messageService: jasmine.SpyObj<MessageService>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideRouter([]), { provide: AuthService, useValue: jasmine.createSpyObj('AuthService', ['login']) }, { provide: MessageService, useValue: jasmine.createSpyObj('MessageService', ['add']) }]
    }).compileComponents();
    component = TestBed.createComponent(LoginComponent).componentInstance;
    form = component.loginForm.controls;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    messageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    router = TestBed.inject(Router);
  });

  it('should create component', () => expect(component).toBeTruthy());

  it('should initialize with empty form', () => {
    expect(component.loginForm.valid).toBeFalse();
    expect(Object.values(form).every(control => control.value === '')).toBeTrue();
  });

  it('should invalidate incorrect inputs', () => {
    ['email', 'password'].forEach(field => {
      form[field].setValue('');
      expect(form[field].valid).toBeFalse();
    });
    
    form['email'].setValue('invalid');
    expect(form['email'].valid).toBeFalse();
  });

  it('should validate correct inputs', () => {
    component.loginForm.setValue(loginRequest);
    expect(component.loginForm.valid).toBeTrue();
  });

  it('should login successfully and navigate', () => {
    authService.login.and.returnValue(of({ accessToken: '', refreshToken: '' }));
    spyOn(router, 'navigate');
    
    component.loginForm.setValue(loginRequest);
    component.login();
    
    expect(authService.login).toHaveBeenCalledWith(loginRequest);
    expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({ severity: 'success', summary: 'Success', detail: userLoggedInSuccessfully }));
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  [{ status: 404, title: 'Login failed', detail: accountNotFound },
   { status: 400, title: 'Login failed', detail: invalidCredentials },
   { status: 500, title: 'Login failed', detail: genericError }].forEach(({ status, title, detail }) => {
    it(`should show correct error message on status ${status}`, () => {
      authService.login.and.returnValue(throwError(() => ({ error: { title, detail }, status })));

      component.loginForm.setValue(loginRequest);
      component.login();

      expect(authService.login).toHaveBeenCalledWith(loginRequest);
      expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({ severity: 'error', summary: title, detail }));
    })
   });
})