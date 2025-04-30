import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { By } from '@angular/platform-browser';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HomeComponent] }).compileComponents();
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

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
});