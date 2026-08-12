import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn } from '@angular/common/http';

import { JwtInterceptor } from '../utils/jwt-interceptor';

describe('JwtInterceptor', () => {
  let interceptor: JwtInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    interceptor = TestBed.inject(JwtInterceptor);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
