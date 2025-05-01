import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { Router, RouterModule } from "@angular/router";
import { LoginComponent } from "../../features/auth/login/login.component";
import { HomeComponent } from "../../features/home/home.component";
import { MessageService } from "primeng/api";
import { routes } from "../../app.routes";

describe('AuthGuard Integration', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HomeComponent, LoginComponent, RouterModule.forRoot(routes)], providers: [MessageService] }).compileComponents();
    fixture = TestBed.createComponent(HomeComponent);
    router = TestBed.inject(Router);
    router.initialNavigation();
  })

  it('should allow access if valid access token exists', fakeAsync(() => {
    localStorage.setItem('accessToken', 'token');
    router.navigate(['']);
    tick();
    
    expect(router.url).toBe('/');
  }));

  it('should redirect to login if no valid token exists', fakeAsync(() => {
    localStorage.removeItem('accessToken');
    router.navigate(['/login']);
    tick();
    
    expect(router.url).toBe('/login');
  }));
});