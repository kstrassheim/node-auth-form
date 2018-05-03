import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public username = "";
  public password = ""; 

  constructor() { }

  public login() {
    if (!this.username) alert("Username missing");
    else if (!this.password) alert("Password missing");
    else {
      alert("Login");
      this.reset();
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
