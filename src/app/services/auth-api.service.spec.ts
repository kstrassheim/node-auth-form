import { TestBed, inject } from '@angular/core/testing';
import { AuthApiService } from '../services/auth-api.service';
import { AuthApiServiceMock, AuthApiServiceMockSuccess, AuthApiServiceMockFail, exampleToken, exampleExpires, exampleUsername, examplePassword, testCaseError } from '../../testing/service-mockups';

describe('AuthApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthApiService, AuthApiServiceMockSuccess, AuthApiServiceMockFail]
    });
  });

  it('should be created', inject([AuthApiService], (service: AuthApiService) => {
    expect(service).toBeTruthy();
  }));

  it('login success path', (done) => inject([AuthApiServiceMockSuccess], async(service: AuthApiServiceMock) => {
    try {
        spyOn(service, "login").and.callThrough();
        let expiresTest = Date.now() + exampleExpires;
        service.setUsernameAndPassword(exampleUsername, examplePassword);
        let ret = await service.getToken();
        expect(service.login).toHaveBeenCalled();
        let t = service.getCurrentToken();
        let e = service.getCurrentTokenExpiration();
        let u = service.getCurrentUsername();
        let p = service.getCurrentPassword();
        expect(t).toBeDefined();
        expect(t).toMatch(ret);
        expect(t).toMatch(exampleToken);
        expect(e).toBeGreaterThanOrEqual(expiresTest);
        expect(u).toMatch(exampleUsername);
        expect(p).toMatch(examplePassword);
        done();
      }
      catch(err) {
        done.fail(err);
      }
    })()
  );

  it('login fail path', (done) => inject([AuthApiServiceMockFail], async(service: AuthApiServiceMock) => {
      try {
        spyOn(service, "login").and.callThrough();

        service.setUsernameAndPassword(exampleUsername, examplePassword);
        var ret = null;
        try {
          ret = await service.getToken();
        }
        catch(err) {
          expect(err).toMatch(testCaseError);
        }

        expect(service.login).toHaveBeenCalled();
        
        let t = service.getCurrentToken();
        let e = service.getCurrentTokenExpiration();
        let u = service.getCurrentUsername();
        let p = service.getCurrentPassword();
        expect(ret).toBeNull();
        expect(t).toBeNull();
        expect(e).toBeNull();
        expect(u).toBeNull();
        expect(p).toBeNull();
        done();
      }
      catch(err) {
        done.fail(err);
      }
    })()
  );

  it('login expiration', (done) => inject([AuthApiServiceMockSuccess], async(service: AuthApiServiceMock) => {
    try {
        spyOn(service, "login").and.callThrough();
        service.setUsernameAndPassword(exampleUsername, examplePassword);
        let ret = await service.getToken();
        expect(service.login).toHaveBeenCalledTimes(1);
        let t = service.getCurrentToken();
        let e = service.getCurrentTokenExpiration();
        expect(t).toBeDefined();
        expect(t).toMatch(ret);

        // call 2 with valid expiration date should avoid login and return the token directly
        ret = await service.getToken();
        expect(service.login).toHaveBeenCalledTimes(1);
        t = service.getCurrentToken();
        expect(t).toBeDefined();
        expect(t).toMatch(ret);

        // call 3 set expiration date to past should call login again and get new token
        service.setCurrentTokenExpiration(Date.now() - 1);
        ret = await service.getToken();
        expect(service.login).toHaveBeenCalledTimes(2);
        t = service.getCurrentToken();
        expect(t).toBeDefined();
        expect(t).toMatch(ret);

        done();
      }
      catch(err) {
        done.fail(err);
      }
    })()
  );
});
