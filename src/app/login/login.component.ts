import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthApiService } from '../services/auth-api.service';
import { LoggerService } from '../services/logger.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  @ViewChild(NgForm) ngForm: NgForm;

  public username = '';
  public password = '';

  constructor(public auth: AuthApiService, public log: LoggerService) {}

  public async login() {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.auth.login(this.username, this.password);
        this.log.logSuccess('Login successfull');
        this.ngForm.resetForm();
        resolve();
      } catch (err) {
        this.log.logError(err);
        reject(err);
      }
    });
  }
}
