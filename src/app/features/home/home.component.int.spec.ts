import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter, Router } from "@angular/router";
import { APP_BASE_HREF } from "@angular/common";
import { By } from "@angular/platform-browser";
import { HomeComponent } from "./home.component";
import { LoginComponent } from "../auth/login/login.component";
import { MessageService } from "primeng/api";

describe('HomeComponent Integration', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([{ path: 'login', component: LoginComponent }]), { provide: APP_BASE_HREF, useValue: '/' }, MessageService]
    }).compileComponents();
    fixture = TestBed.createComponent(HomeComponent);
    router = TestBed.inject(Router);
    fixture.detectChanges()
  });

  it('should logout and navigate to login', async () => {
    spyOn(localStorage, 'removeItem').and.callThrough();
    spyOn(router, 'navigate').and.callThrough();

    const logoutButtonElement = fixture.debugElement.query(By.css('button'));
    logoutButtonElement.nativeElement.click();
    fixture.detectChanges();

    expect(localStorage.removeItem).toHaveBeenCalledWith('accessToken');
    expect(localStorage.removeItem).toHaveBeenCalledWith('refreshToken');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});