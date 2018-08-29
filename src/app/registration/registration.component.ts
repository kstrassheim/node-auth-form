import { Component, OnInit } from '@angular/core';
import { AuthApiService } from '../services/auth-api.service';
import { LoggerService } from '../services/logger.service';
import { ValidatorFn, AbstractControl } from "@angular/forms";

export const matchValidator = (field1, field2): ValidatorFn => (control: AbstractControl) => {
  if(control.get(field1).value===control.get(field2).value) {
      return null;
  }
  return { matchValidator: { valid: false } };
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

export class RegistrationComponent implements OnInit {

  public username:string;
  public password:string;
  public repeat:string;

  constructor(public auth:AuthApiService, public log:LoggerService) { }

  ngOnInit() {
    this.reset();
  }

  public async save() {
    try {
      this.log.logSuccess("SAve");
      // if (!this.username) this.log.logWarning('Username missing');
      // else if (!this.password) this.log.logWarning('Password missing');
      // else if (this.password !== this.repeat) this.log.logWarning('Password not same');
      // else {
      //   const res = await this.auth.register(this.username, this.password);
      //   if (res == 1) {
      //     this.log.logSuccess('Success');
      //     this.reset();
      //   }
      //   else if (res == 2) {
      //     this.log.logWarning('User already exists');
      //   }
      //   else {
      //     this.log.logError('Unknown');
      //   }
      //}
    }
    catch(err) {
      this.log.logError(err);
    }
  }

  public reset() {
    this.username = '';
    this.password = '';
    this.repeat = '';
  }
}
