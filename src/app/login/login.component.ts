import { Component, OnInit } from '@angular/core';
import { AuthApiService } from '../services/auth-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public username = "";
  public password = ""; 

  constructor(public AuthApiService:AuthApiService) { }

  public async login() {
    if (!this.username) alert("Username missing");
    else if (!this.password) alert("Password missing");
    else {
      try {
        var t = await this.AuthApiService.login(this.username, this.password);
        alert(`Login successfull, Token: ${t}`);
        this.reset();
      }
      catch(err) {
        alert(`Login failed, ${err}`);
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
