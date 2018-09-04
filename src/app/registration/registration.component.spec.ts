import { async, ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthApiServiceMockSuccess } from '../../testing/service-mockups';
import { AuthApiService } from '../services/auth-api.service';
import { LoggerService } from '../services/logger.service';
import { RegistrationComponent } from './registration.component';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;
  let form: NgForm;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationComponent ],
      imports:[FormsModule],
      providers: [ 
        {provide: AuthApiService, useValue: new AuthApiServiceMockSuccess() },
        {provide: LoggerService, useValue: new LoggerService() }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    form = (<any>component).ngForm; 
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form submit success', () => {
    spyOn(component, 'save').and.callThrough();
    spyOn(component.log, 'logSuccess').and.callThrough();
    component.username = 'Mike';
    component.password = '1234';
    component.repeat = '1234';
    form.ngSubmit.emit();
    expect(form.valid).toBeTruthy();
    expect(component.save).toHaveBeenCalled();
    expect(component.log.logSuccess).toHaveBeenCalled();
  });

});
