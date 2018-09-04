import { Component, OnInit, Directive } from '@angular/core';
import { AuthApiService } from '../services/auth-api.service';
import { LoggerService } from '../services/logger.service';
import { ValidatorFn, AbstractControl, FormGroup, NG_VALIDATORS } from "@angular/forms";

export const PasswordsMatchValidator = (fg: FormGroup): ValidatorFn => (control: AbstractControl) => {
  const password = fg.get('password').value;
  const repeat = fg.get('repeat').value;
  if(password===repeat) {
      return { passwordsMatchValidator: { valid: true } };
  }
  return { passwordsMatchValidator: { valid: false } };
}
@Directive({  
    selector: '[passwordsMatchValidator][ngModel]',  
    providers: [{ provide: NG_VALIDATORS,useExisting: NG_VALIDATORS, multi: true } ]  
})
export class PasswordsMatchDirective {}

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
