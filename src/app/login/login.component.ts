import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthApiService } from '../services/auth-api.service';
import { LoggerService } from '../services/logger.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public username = "";
  public password = ""; 

  constructor(public auth:AuthApiService, public log:LoggerService, private router: Router) {
    
  }

  public async login() {
    if (!this.username) alert("Username missing");
    else if (!this.password) alert("Password missing");
    else {
      try {
        this.auth.setUsernameAndPassword(this.username, this.password);
        await this.auth.login();
        this.log.logInfo(`Login successfull`);
        this.reset();
        // if url is set navigate to it
        let url = this.auth.redirectUrl.getValue();
        if (url)
          this.router.navigateByUrl(url);
      }
      catch(err) {
        this.log.logError(err);
      }
    }
  }

  public reset() {
    this.username = "";
    this.password = "";
  }

  ngOnInit() {
    this.reset();
  }
}
