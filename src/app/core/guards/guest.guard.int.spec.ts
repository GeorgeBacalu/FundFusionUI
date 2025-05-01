import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { Router, RouterModule } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { LoginComponent } from "../../features/auth/login/login.component";
import { HomeComponent } from "../../features/home/home.component";
import { MessageService } from "primeng/api";
import { routes } from "../../app.routes";

describe('GuestGuard Integration', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoginComponent, HomeComponent, RouterModule.forRoot(routes)],
      providers: [MessageService, provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    router = TestBed.inject(Router);
    router.initialNavigation();
  });

  it('should allow access if no valid access token exists', fakeAsync(() => {
    localStorage.removeItem('accessToken');
    router.navigate(['/login']);
    tick();

    expect(router.url).toBe('/login');
  }));

  it('should redirect to home if valid access token exists', fakeAsync(() => {
    localStorage.setItem('accessToken', 'token');
    router.navigate(['/']);
    tick();

    expect(router.url).toBe('/');
  }));
});