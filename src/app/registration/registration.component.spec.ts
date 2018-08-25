import { async, ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AuthApiServiceMockSuccess } from '../../testing/service-mockups';
import { AuthApiService } from '../services/auth-api.service';
import { LoggerService } from '../services/logger.service';
import { RegistrationComponent } from './registration.component';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('validation message called', () => {
    spyOn(component.log, 'logWarning').and.callThrough();
    component.save();
    expect(component.log.logWarning).toHaveBeenCalled();
  });

});
