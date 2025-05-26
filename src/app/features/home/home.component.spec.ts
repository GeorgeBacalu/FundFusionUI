import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { By } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { userLoggedOutSuccessfully } from '../../shared/constants/constants';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let messageService: jasmine.SpyObj<MessageService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [{ provide: MessageService, useValue: jasmine.createSpyObj('MessageService', ['add']) }, { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) }]
    }).compileComponents();
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    messageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create component', () => expect(component).toBeTruthy());

  it('should display the logo image', () => {
    const imageElement = fixture.debugElement.query(By.css('img'));
    expect(imageElement).toBeTruthy();
    expect(imageElement.attributes['src']).toContain('assets/images/logo.jpeg');
    expect(imageElement.attributes['alt']).toContain('FundFusion Logo');
  });

  it('should display the app name', () => {
    const titleElement = fixture.debugElement.query(By.css('.text-2xl'));
    expect(titleElement.nativeElement.textContent).toContain('Fund Fusion');
  })

  it('should display the welcome message', () => {
    const headingElement = fixture.debugElement.query(By.css('h1'));
    expect(headingElement.nativeElement.textContent).toContain('Welcome to Fund Fusion!');
  });

  it('should clear tokens and navigate on logout', () => {
    spyOn(localStorage, 'removeItem');

    component.logout();

    expect(localStorage.removeItem).toHaveBeenCalledWith('accessToken');
    expect(localStorage.removeItem).toHaveBeenCalledWith('refreshToken');
    expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({ severity: 'success', summary: 'Success', detail: userLoggedOutSuccessfully }));
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
