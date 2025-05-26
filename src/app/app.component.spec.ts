import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [AppComponent] }).compileComponents());

  it('should create component', () => expect(TestBed.createComponent(AppComponent).componentInstance).toBeTruthy());
});
