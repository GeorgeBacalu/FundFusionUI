import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let router: jasmine.SpyObj<Router>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  const executeGuard: CanActivateFn = (...guardParameters) => TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({ providers: [{ provide: Router, useValue: router }]});
    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: '/' } as RouterStateSnapshot;
  });

  it('should be created', () => expect(executeGuard).toBeTruthy());

  it('should allow access if valid access token exists', () => {
    spyOn(localStorage, 'getItem').and.returnValue('token');
    const result = executeGuard(mockRoute, mockState);
    expect(result).toBeTrue();
  });

  it('should redirect to login if no valid token exists', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    const result = executeGuard(mockRoute, mockState);
    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});