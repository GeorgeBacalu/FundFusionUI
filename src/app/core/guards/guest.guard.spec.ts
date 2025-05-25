import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { guestGuard } from './guest.guard';

describe('guestGuard', () => {
  let router: jasmine.SpyObj<Router>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  const executeGuard: CanActivateFn = (...guardParameters) => TestBed.runInInjectionContext(() => guestGuard(...guardParameters));

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({ providers: [{ provide: Router, useValue: router }]});
    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '/login' } as RouterStateSnapshot;
  });

  it('should be created', () => expect(executeGuard).toBeTruthy());

  it('should allow access if no valid access token exists', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    const result = executeGuard(mockRoute, mockState);
    expect(result).toBeTrue();
  });

  it('should redirect to home if valid access token exists', () => {
    spyOn(localStorage, 'getItem').and.returnValue('token');
    const result = executeGuard(mockRoute, mockState);
    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
