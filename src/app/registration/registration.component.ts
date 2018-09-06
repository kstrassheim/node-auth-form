import { Component, OnInit, ViewChild } from '@angular/core';
import {NgForm} from '@angular/forms';
import { AuthApiService } from '../services/auth-api.service';
import { LoggerService } from '../services/logger.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  @ViewChild(NgForm) ngForm: NgForm;
  public username:string;
  public password:string;
  public repeat:string;

  constructor(public auth:AuthApiService, public log:LoggerService) { }

  ngOnInit() {
    this.reset();
  }

  public async save() {
    try {
      const res = await this.auth.register(this.username, this.password);
      if (res === 1) this.log.logSuccess('Registration successfull');
      else if (res === 2) this.log.logWarning('Username is already existing');
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
