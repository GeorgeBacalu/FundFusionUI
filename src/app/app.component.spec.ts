import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [AppComponent] }));

  it('should create component', () => {
    const component = TestBed.createComponent(AppComponent).debugElement.componentInstance;
    expect(component).toBeTruthy();
  });
});