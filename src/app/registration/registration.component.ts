import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  public username = "";
  public password = "";
  public repeat = "";

  constructor() { }

  public save() {
    if (!this.username) alert("Username missing");
    else if (!this.password) alert("Password missing");
    else if (this.password !== this.repeat) alert("Password not same");
    else {
      alert("Success");
    }
  }

  public reset() {
    this.username = "";
    this.password = "";
    this.repeat = "";
  }

  ngOnInit() {
    this.reset();
  }
}
