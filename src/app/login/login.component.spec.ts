import { async, fakeAsync, ComponentFixture, TestBed, flush, tick, flushMicrotasks } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthApiServiceMockSuccess } from '../../testing/service-mockups';
import { AuthApiService } from '../services/auth-api.service';
import { LoggerService } from '../services/logger.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [FormsModule, RouterTestingModule],
      providers: [
        {provide: AuthApiService, useValue: new AuthApiServiceMockSuccess() },
        {provide: LoggerService, useValue: new LoggerService() }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('login successfull', async (done) => {
    spyOn(component.auth, 'login').and.returnValue(Promise.resolve());
    spyOn(component.log, 'logSuccess').and.callThrough();
    spyOn(component.log, 'logError').and.callThrough();
    component.username = 'Mike';
    component.password = '1234';
    await component.login();
    expect(component.auth.login).toHaveBeenCalledTimes(1);
    expect(component.log.logSuccess).toHaveBeenCalledTimes(1);
    expect(component.log.logError).toHaveBeenCalledTimes(0);
    done();
  });

  it('login failed', async () => {
    spyOn(component.auth, 'login').and.returnValue(Promise.reject('Fake Error'));
    spyOn(component.log, 'logSuccess').and.callThrough();
    spyOn(component.log, 'logError').and.callThrough();
    component.username = 'Mike';
    component.password = '1234';
    try {
      await component.login();
    } catch (err) {
      expect(component.auth.login).toHaveBeenCalledTimes(1);
      expect(component.log.logSuccess).toHaveBeenCalledTimes(0);
      expect(component.log.logError).toHaveBeenCalledTimes(1);
    }
  });
});
