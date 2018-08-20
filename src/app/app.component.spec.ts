import { TestBed, inject, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthApiServiceMock, AuthApiServiceMockSuccess, AuthApiServiceMockFail, exampleToken } from '../testing/service-mockups';
import { AuthApiService } from './services/auth-api.service';
import { LoggerService } from './services/logger.service';
import { CookieService } from 'ngx-cookie';

let cookieServiceStub: Partial<CookieService>;
cookieServiceStub = { 
  get : (key:string) => { return null; },
  put : (key:string, value:string) => {}
};

let cookieServiceStubToken: Partial<CookieService>;
cookieServiceStubToken = { 
  get : (key:string) => { return key == "token" ? exampleToken : null; },
  put : (key:string, value:string) => {}
};

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports:[RouterTestingModule, FormsModule],
      providers: [ 
        {provide: AuthApiService, useValue: new AuthApiServiceMockSuccess() },
        {provide: LoggerService, useValue: new LoggerService() },
        {provide: CookieService, useValue: cookieServiceStub },
      ]
    }).compileComponents();
  }));

  // it('should create the app', async(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app).toBeTruthy();
  // }));

  it('should login automatically', (done) => inject([AuthApiServiceMockFail], async(service: AuthApiServiceMock) => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  // it('should save redirect url', async(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app).toBeTruthy();
  // }));

  // it('should redirect automatically after successfull login', async(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app).toBeTruthy();
  // }));

  // it('should redirect automatically after cookie token valid', async(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app).toBeTruthy();
  // }));
});
