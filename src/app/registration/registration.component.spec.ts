import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';

import { AuthApiServiceMockSuccess } from '../../testing/service-mockups';
import { AuthApiService } from '../services/auth-api.service';
import { LoggerService } from '../services/logger.service';
import { RegistrationComponent } from './registration.component';
import { EqualValidator } from '../directives/validateEqual';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;
  let form: NgForm;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationComponent, EqualValidator ],
      imports:[FormsModule],
      providers: [ 
        {provide: AuthApiService, useValue: new AuthApiServiceMockSuccess() },
        {provide: LoggerService, useValue: new LoggerService() }
      ]
    })
    .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RegistrationComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    component.ngOnInit();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('save successfull', async (done) => {
    spyOn(component.auth, 'register').and.callThrough();
    spyOn(component.log, 'logSuccess').and.callThrough();
    spyOn(component.log, 'logWarning').and.callThrough();
    spyOn(component.log, 'logError').and.callThrough();
    component.username = 'Mike';
    component.password = '1234';
    component.repeat = '1234';
    await component.save();
    expect(component.auth.register).toHaveBeenCalledTimes(1);
    expect(component.log.logSuccess).toHaveBeenCalledTimes(1);
    expect(component.log.logWarning).toHaveBeenCalledTimes(0);
    expect(component.log.logError).toHaveBeenCalledTimes(0);
    done();
  });

  it('save exists', async (done) => {
    spyOn(component.auth, 'register').and.callFake(async ()=>{ return new Promise<number>((resolve)=>resolve(2)); });
    spyOn(component.log, 'logSuccess').and.callThrough();
    spyOn(component.log, 'logWarning').and.callThrough();
    spyOn(component.log, 'logError').and.callThrough();
    component.username = 'Mike';
    component.password = '1234';
    component.repeat = '1234';
    await component.save();
    expect(component.auth.register).toHaveBeenCalledTimes(1);
    expect(component.log.logSuccess).toHaveBeenCalledTimes(0);
    expect(component.log.logWarning).toHaveBeenCalledTimes(1);
    expect(component.log.logError).toHaveBeenCalledTimes(0);
    done();
  });

  it('save failed', async (done) => {
    spyOn(component.auth, 'register').and.callFake(async()=>{ return new Promise<number>((resolve, reject)=>reject('Test error')); });
    spyOn(component.log, 'logSuccess').and.callThrough();
    spyOn(component.log, 'logWarning').and.callThrough();
    spyOn(component.log, 'logError').and.callThrough();
    component.username = 'Mike';
    component.password = '1234';
    component.repeat = '1234';
    await component.save();
    expect(component.auth.register).toHaveBeenCalledTimes(1);
    expect(component.log.logSuccess).toHaveBeenCalledTimes(0);
    expect(component.log.logWarning).toHaveBeenCalledTimes(0);
    expect(component.log.logError).toHaveBeenCalledTimes(1);
    done();
  });

  it('form validation success', async (done) => {
    spyOn(component, 'save').and.callThrough();
    component.username = 'Mike';
    component.password = '1234';
    component.repeat = '1234';
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.ngForm.valid).toBeTruthy();
    component.ngForm.ngSubmit.emit();
    await fixture.whenStable();
    expect(component.save).toHaveBeenCalled();
    done();
  });

  it('form validation required failed', async (done) => {
    spyOn(component, 'save').and.callThrough();
    component.username = '';
    component.password = '';
    component.repeat = '';
    fixture.detectChanges();
    await fixture.whenStable();
    component.ngForm.ngSubmit.emit();
    await fixture.whenStable();
    expect(component.ngForm.valid).toBeFalsy();
    expect(component.ngForm.controls.username.errors.required).toBeTruthy();
    expect(component.ngForm.controls.password.errors.required).toBeTruthy();
    expect(component.ngForm.controls.repeat.errors.required).toBeTruthy();
    expect(component.save).toHaveBeenCalledTimes(0);
    done();
  });

  it('form validation passwords match failed', async (done) => {
    spyOn(component, 'save').and.callThrough();
    component.username = 'Mike';
    component.password = '1234';
    component.repeat = '12345';
    fixture.detectChanges();
    await fixture.whenStable();
    component.ngForm.ngSubmit.emit();
    await fixture.whenStable();
    expect(component.ngForm.valid).toBeFalsy();
    expect(component.ngForm.controls.repeat.errors.validateEqual).toBeTruthy();
    expect(component.save).toHaveBeenCalledTimes(0);
    done();
  });

});
