import { TestBed, inject, tick } from '@angular/core/testing';
import { AuthApiService } from '../services/auth-api.service';
import { AuthApiServiceMock, AuthApiServiceMockSuccess, AuthApiServiceMockExist, AuthApiServiceMockFail, exampleToken, exampleUsername, examplePassword, registrationSuccessStatus, registrationExistStatus, testCaseError } from '../../testing/service-mockups';
import { async } from 'q';

describe('AuthApiService',  () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthApiService, AuthApiServiceMockSuccess, AuthApiServiceMockExist, AuthApiServiceMockFail]
    });
  });

  it('should be created', inject([AuthApiService], (service: AuthApiService) => {
    expect(service).toBeTruthy();
  }));

  it('setTokenIfValid success path', (done) => inject([AuthApiServiceMockSuccess], async(service: AuthApiServiceMock) => {
    try {
        spyOn((<any>service).onLoggedIn, "next").and.callFake(function(token:string) {
          expect(token).toBeDefined();
          expect(token).toMatch(exampleToken);
        });
        spyOn<any>(service, "errorLog").and.callThrough();
       
        await service.setTokenIfValid(exampleToken);
        expect((<any>service).errorLog).toHaveBeenCalledTimes(0);
        expect((<any>service).onLoggedIn.next).toHaveBeenCalledTimes(1);
        //let t = service.getCurrentToken();
        
        done();
      }
      catch(err) {
        done.fail(err);
      }
    })()
  );

  it('setTokenIfValid null path', (done) => inject([AuthApiServiceMockFail], async(service: AuthApiServiceMock) => {
      try {
        spyOn((<any>service).onLoggedIn, "next").and.callThrough();
        spyOn<any>(service, "errorLog").and.callThrough();
        await service.setTokenIfValid(null);
        expect((<any>service).errorLog).toHaveBeenCalledTimes(0);
        expect((<any>service).onLoggedIn.next).toHaveBeenCalledTimes(0);
        done();
      }
      catch(err) {
        done.fail(err);
      }
    })()
  );

  it('setTokenIfValid undefined path', (done) => inject([AuthApiServiceMockFail], async(service: AuthApiServiceMock) => {
      try {
        spyOn((<any>service).onLoggedIn, "next").and.callThrough();
        spyOn<any>(service, "errorLog").and.callThrough();
        await service.setTokenIfValid(undefined);
        expect((<any>service).errorLog).toHaveBeenCalledTimes(0);
        expect((<any>service).onLoggedIn.next).toHaveBeenCalledTimes(0);
        done();
      }
      catch(err) {
        done.fail(err);
      }
    })()
  );  

  it('setTokenIfValid fail path', (done) => inject([AuthApiServiceMockFail], async(service: AuthApiServiceMock) => {
      try {
        spyOn((<any>service).onLoggedIn, "next").and.callThrough();
        spyOn<any>(service, "errorLog").and.callThrough();
        try {
          await service.setTokenIfValid(exampleToken);
          done.fail();
        }
        catch(err) {
          expect(err).toMatch(testCaseError);
        }
        expect((<any>service).errorLog).toHaveBeenCalledTimes(1);
        expect((<any>service).onLoggedIn.next).toHaveBeenCalledTimes(0);
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
        spyOn((<any>service).onLoggedIn, "next").and.callFake(function(token:string) {
          expect(token).toBeDefined();
          expect(token).toMatch(exampleToken);
        });
        spyOn<any>(service, "errorLog").and.callThrough();
        await service.login(exampleUsername, examplePassword);
        expect((<any>service).errorLog).toHaveBeenCalledTimes(0);
        expect(service.setTokenIfValid).toHaveBeenCalledTimes(1);
        expect((<any>service).onLoggedIn.next).toHaveBeenCalledTimes(1);
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
        spyOn((<any>service).onLoggedIn, "next").and.callThrough();
        spyOn<any>(service, "errorLog").and.callThrough();
        try {
          await service.login(exampleUsername, examplePassword);
          done.fail();
        }
        catch(err) {
          expect(err).toMatch(testCaseError);
        }
        expect((<any>service).errorLog).toHaveBeenCalledTimes(1);
        expect(service.setTokenIfValid).toHaveBeenCalledTimes(0);
        expect((<any>service).onLoggedIn.next).toHaveBeenCalledTimes(0);
        done();
      }
      catch(err) {
        done.fail(err);
      }
    })()
  );

  it('register success path', (done) => inject([AuthApiServiceMockSuccess], async(service: AuthApiServiceMock) => {
    try {
        spyOn<any>(service, "errorLog").and.callThrough();
        const res = await service.register(exampleUsername, examplePassword);
        expect((<any>service).errorLog).toHaveBeenCalledTimes(0);
        expect(res).toEqual(registrationSuccessStatus);
        done();
      }
      catch(err) {
        done.fail(err);
      }
    })()
  );

  it('register exist path', (done) => inject([AuthApiServiceMockExist], async(service: AuthApiServiceMock) => {
    try {
        spyOn<any>(service, "errorLog").and.callThrough();
        const res = await service.register(exampleUsername, examplePassword);
        expect((<any>service).errorLog).toHaveBeenCalledTimes(0);
        expect(res).toEqual(registrationExistStatus);
        done();
      }
      catch(err) {
        done.fail(err);
      }
    })()
  );

  it('register fail path', (done) => inject([AuthApiServiceMockFail], async(service: AuthApiServiceMock) => {
      try {
        spyOn<any>(service, "errorLog").and.callThrough();
        try {
          await service.register(exampleUsername, examplePassword);
          done.fail();
        }
        catch(err) {
          expect(err).toMatch(testCaseError);
        }
        expect((<any>service).errorLog).toHaveBeenCalledTimes(1);
        done();
      }
      catch(err) {
        done.fail(err);
      }
    })()
  );
});
