import { TestBed, inject } from '@angular/core/testing';
import { LoggerService } from './logger.service';
import * as toastr from '../../../node_modules/toastr';

describe('LoggerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggerService]
    });
  });

  it('should be created', inject([LoggerService], (service: LoggerService) => {
    expect(service).toBeTruthy();
  }));

  it('test success call', inject([LoggerService], (service: LoggerService) => {
    spyOn(toastr, 'success').and.callThrough();
    spyOn(console, 'log').and.callThrough();
    service.logSuccess('test message');
    expect(toastr.success).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalled();
  }));

  it('test info call', inject([LoggerService], (service: LoggerService) => {
    spyOn(toastr, 'info').and.callThrough();
    spyOn(console, 'log').and.callThrough();
    service.logInfo('test message');
    expect(toastr.info).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalled();
  }));

  it('test warning call', inject([LoggerService], (service: LoggerService) => {
    spyOn(toastr, 'warning').and.callThrough();
    spyOn(console, 'log').and.callThrough();
    service.logWarning('test message');
    expect(toastr.warning).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalled();
  }));

  it('test error call', inject([LoggerService], (service: LoggerService) => {
    spyOn(toastr, 'error').and.callThrough();
    spyOn(console, 'error').and.callThrough();
    service.logError('test message');
    expect(toastr.error).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  }));

  it('test success call silent', inject([LoggerService], (service: LoggerService) => {
    spyOn(toastr, 'success').and.callThrough();
    spyOn(console, 'log').and.callThrough();
    service.logSuccess('test message', false);
    expect(toastr.success).toHaveBeenCalledTimes(0);
    expect(console.log).toHaveBeenCalled();
  }));

  it('test info call silent', inject([LoggerService], (service: LoggerService) => {
    spyOn(toastr, 'info').and.callThrough();
    spyOn(console, 'log').and.callThrough();
    service.logInfo('test message', false);
    expect(toastr.info).toHaveBeenCalledTimes(0);
    expect(console.log).toHaveBeenCalled();
  }));

  it('test warning call silent', inject([LoggerService], (service: LoggerService) => {
    spyOn(toastr, 'warning').and.callThrough();
    spyOn(console, 'log').and.callThrough();
    service.logWarning('test message', false);
    expect(toastr.warning).toHaveBeenCalledTimes(0);
    expect(console.log).toHaveBeenCalled();
  }));

  it('test error call silent', inject([LoggerService], (service: LoggerService) => {
    spyOn(toastr, 'error').and.callThrough();
    spyOn(console, 'error').and.callThrough();
    service.logError('test message', false);
    expect(toastr.error).toHaveBeenCalledTimes(0);
    expect(console.error).toHaveBeenCalled();
  }));
});
