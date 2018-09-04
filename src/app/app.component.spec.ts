import { Component } from '@angular/core';
import {cloneDeep} from 'lodash';
import { TestBed, async, fakeAsync, tick, flush } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthApiServiceMockSuccess, exampleToken } from '../testing/service-mockups';
import { AuthApiService } from './services/auth-api.service';
import { LoggerService } from './services/logger.service';
import { CookieService } from 'ngx-cookie';
import { doesNotThrow } from 'assert';

const testExampleToken = exampleToken;
let cookieServiceStub: Partial<CookieService>;
cookieServiceStub = { 
  get : (key:string) => {
    return null;
  },
  put : (key:string,value:string) => {}
};

// mock window methods

const exampleRedirectUrl = 'http://www.google.ch?token={0}'
const exampleRedirectUrlParam = encodeURIComponent(exampleRedirectUrl);
const exampleFinalRedirectUrl = exampleRedirectUrl.replace('{0}', exampleToken);

(<any>AppComponent.prototype).getWindowLocationHref = () => {  return window.location.href + '?redirectUrl=' + exampleRedirectUrlParam; };
(<any>AppComponent.prototype).setWindowLocationHref = (url:string) => { };

const testBedConfig = {
  declarations: [
    AppComponent
  ],
  imports: [RouterTestingModule, FormsModule],
  providers: [ 
    {provide: AuthApiService, useValue: new AuthApiServiceMockSuccess() },
    {provide: LoggerService, useValue: new LoggerService() },
    {provide: CookieService, useValue: cookieServiceStub },
  ]
};

describe('AppComponent without cookie token', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule(testBedConfig).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`saves redirect url`, fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    spyOn((<any>app), "getWindowLocationHref").and.callThrough();
    spyOn((<any>app), "setWindowLocationHref").and.callThrough();
    app.ngOnInit();
    expect((<any>app).getWindowLocationHref).toHaveBeenCalled();
    expect(app.redirectUrl).toEqual(exampleRedirectUrl);
  }));

  it('redirects after logon', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    spyOn((<any>app), "setWindowLocationHref").and.callFake((redirectUrl:string) => {
      expect(redirectUrl).toEqual(exampleFinalRedirectUrl);
    });
    app.ngOnInit();
    app.onLoggedIn(testExampleToken);
    tick();
    expect((<any>app).setWindowLocationHref).toHaveBeenCalledTimes(1);
    
  }));

  it('check title', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('a.navbar-brand').textContent).toContain('Node Auth Form');
  }));
});

describe('AppComponent with cookie token - ', () => {

  let cookieServiceStubWithToken: Partial<CookieService>;
  cookieServiceStubWithToken = { 
    get : (key:string) => {
      return key == 'token' ? testExampleToken : null;
    },
    put : (key:string,value:string) => {}
  };

  let testBedConfigCookieServiceStubToken = cloneDeep(testBedConfig,true);
  testBedConfigCookieServiceStubToken.providers[2].useValue = cookieServiceStubWithToken;  

  beforeEach(async(() => {
    TestBed.configureTestingModule(testBedConfigCookieServiceStubToken).compileComponents();
  }));

  it('redirects immediately with valid token', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    spyOn((<any>app), "setWindowLocationHref").and.callFake((redirectUrl:string) => {
      expect(redirectUrl).toEqual(exampleFinalRedirectUrl);
    });
    app.ngOnInit();
    tick();
    expect((<any>app).setWindowLocationHref).toHaveBeenCalled();
  }));
});
