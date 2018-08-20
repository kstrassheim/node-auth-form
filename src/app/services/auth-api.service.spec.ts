import { TestBed, inject } from '@angular/core/testing';
import { AuthApiService } from '../services/auth-api.service';
import { AuthApiServiceMock, AuthApiServiceMockSuccess, AuthApiServiceMockFail, exampleToken, exampleExpires, exampleUsername, examplePassword, testCaseError } from '../../testing/service-mockups';

describe('AuthApiService',  () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthApiService, AuthApiServiceMockSuccess, AuthApiServiceMockFail]
    });
  });

  it('should be created', inject([AuthApiService], (service: AuthApiService) => {
    expect(service).toBeTruthy();
  }));

  it('setTokenIfValid success path', (done) => inject([AuthApiServiceMockSuccess], async(service: AuthApiServiceMock) => {
    try {
        spyOn((<any>service).token, "next").and.callThrough();
        spyOn<any>(service, "errorLog").and.callThrough();
       
        await service.setTokenIfValid(exampleToken);
        expect((<any>service).errorLog).toHaveBeenCalledTimes(0);
        expect((<any>service).token.next).toHaveBeenCalledTimes(1);
        let t = service.getCurrentToken();
        expect(t).toBeDefined();
        expect(t).toMatch(exampleToken);
        done();
      }
      catch(err) {
        done.fail(err);
      }
    })()
  );

  it('setTokenIfValid fail path', (done) => inject([AuthApiServiceMockFail], async(service: AuthApiServiceMock) => {
      try {
        spyOn((<any>service).token, "next").and.callThrough();
        spyOn<any>(service, "errorLog").and.callThrough();
        try {
          await service.setTokenIfValid(exampleToken);
        }
        catch(err) {
          expect(err).toMatch(testCaseError);
        }
        expect((<any>service).errorLog).toHaveBeenCalledTimes(1);
        expect((<any>service).token.next).toHaveBeenCalledTimes(0);
        let t = service.getCurrentToken();
        expect(t).toBeNull();
        done();
      }
      catch(err) {
        done.fail(err);
      }
    })()
  );

  it('login success path', (done) => inject([AuthApiServiceMockSuccess], async(service: AuthApiServiceMock) => {
    try {
        spyOn(service, "setTokenIfValid").and.callThrough();
        spyOn((<any>service).token, "next").and.callThrough();
        spyOn<any>(service, "errorLog").and.callThrough();
        await service.login(exampleUsername, examplePassword);
        expect((<any>service).errorLog).toHaveBeenCalledTimes(0);
        expect(service.setTokenIfValid).toHaveBeenCalledTimes(1);
        expect((<any>service).token.next).toHaveBeenCalledTimes(1);
        let t = service.getCurrentToken();
        expect(t).toBeDefined();
        expect(t).toMatch(exampleToken);
        done();
      }
      catch(err) {
        done.fail(err);
      }
    })()
  );

  it('login fail path', (done) => inject([AuthApiServiceMockFail], async(service: AuthApiServiceMock) => {
      try {
        spyOn(service, "setTokenIfValid").and.callThrough();
        spyOn((<any>service).token, "next").and.callThrough();
        spyOn<any>(service, "errorLog").and.callThrough();
        try {
          await service.login(exampleUsername, examplePassword);
        }
        catch(err) {
          expect(err).toMatch(testCaseError);
        }
        expect((<any>service).errorLog).toHaveBeenCalledTimes(1);
        expect(service.setTokenIfValid).toHaveBeenCalledTimes(0);
        expect((<any>service).token.next).toHaveBeenCalledTimes(0);
        let t = service.getCurrentToken();
        expect(t).toBeNull();
        done();
      }
      catch(err) {
        done.fail(err);
      }
    })()
  );
});
