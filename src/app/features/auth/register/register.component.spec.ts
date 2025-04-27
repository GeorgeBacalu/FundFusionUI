import { TestBed } from "@angular/core/testing";
import { FormGroup } from "@angular/forms";
import { provideRouter, Router } from "@angular/router";
import { of, throwError } from "rxjs";
import { RegisterComponent } from "./register.component";
import { AuthService } from "../../../core/services/auth.service";
import { registerRequest } from "../../../shared/mocks/user.mock";
import { userRegisteredSuccessfully } from "../../../shared/constants/constants";

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let form: FormGroup['controls'];
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [provideRouter([]), { provide: AuthService, useValue: jasmine.createSpyObj('AuthService', ['register']) }]
    });
    component = TestBed.createComponent(RegisterComponent).debugElement.componentInstance;
    form = component.registerForm.controls;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
  });

  it('should create component', () => expect(component).toBeTruthy());

  it('should initialize with empty form', () => {
    expect(component.registerForm.valid).toBeFalse();
    expect(Object.values(form).every(control => control.value === '')).toBeTrue();
  });

  it('should invalidate incorrect inputs', () => {
    ['name', 'email', 'password', 'confirmedPassword', 'phone'].forEach(field => {
      form[field].setValue('');
      expect(form[field].valid).toBeFalse();
    });
    
    form['email'].setValue('invalid');
    expect(form['email'].valid).toBeFalse();
    
    form['password'].setValue('weakpass');
    expect(form['password'].valid).toBeFalse();
    
    form['password'].setValue('StrongPass0!');
    form['confirmedPassword'].setValue('Mismatch0!');
    expect(component.registerForm.errors?.['passwordMismatch']).toBeTrue();
  });

  it('should validate correct inputs', () => {
    component.registerForm.setValue(registerRequest);
    expect(component.registerForm.valid).toBeTrue();
  });

  it('should register successfully and navigate', () => {
    authService.register.and.returnValue(of({ message: userRegisteredSuccessfully }));
    spyOn(router, 'navigate');
    
    component.registerForm.setValue(registerRequest);
    component.register();

    expect(authService.register).toHaveBeenCalledWith(registerRequest);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  [{ field: 'name', title: 'Duplicated name', detail: 'This name is already taken' },
   { field: 'email', title: 'Duplicated email', detail: 'This email is already taken' },
   { field: 'phone', title: 'Duplicated phone', detail: 'This phone is already taken' }].forEach(({ field, title, detail }) => {
    it(`should show error toast if ${field} is already taken`, () => {
      authService.register.and.returnValue(throwError(() => ({ error: { title, detail } })));

      component.registerForm.setValue(registerRequest);
      component.register();

      expect(authService.register).toHaveBeenCalledWith(registerRequest);
      });
    })
});