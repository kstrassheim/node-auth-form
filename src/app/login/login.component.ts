import { Component, OnInit } from '@angular/core';
import { AuthApiService } from '../services/auth-api.service';
import { LoggerService } from '../services/logger.service';
import { reject } from 'q';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public username = '';
  public password = ''; 

  constructor(public auth:AuthApiService, public log:LoggerService) {}

  public async login() {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.auth.login(this.username, this.password);
        this.log.logSuccess('Login successfull');
        this.reset();
        resolve();
      }
      catch(err) {
        this.log.logError(err);
        reject(err);
      }
    });
  }

  public reset() {
    this.username = "";
    this.password = "";
  }

  ngOnInit() {
    this.reset();
  }
}
