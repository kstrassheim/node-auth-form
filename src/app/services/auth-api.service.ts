import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ReadKeyExpr } from '@angular/compiler';

@Injectable()
export class AuthApiService {

  private static url = "https://nodeauthweb.azurewebsites.net/auth/login";

  private username = new BehaviorSubject<string>(null);
  public readonly username$ = this.username.asObservable();
  private password = new BehaviorSubject<string>(null);
  public readonly password$ = this.password.asObservable();
  private token = new BehaviorSubject<string>(null);
  public readonly token$ = this.token.asObservable();
  private tokenExpiration= new BehaviorSubject<Date>(null);
  public readonly tokenExpiration$ = this.tokenExpiration.asObservable();
  public redirectUrl = new BehaviorSubject<string>(null);

  public setUsernameAndPassword(username:string, password:string, token?:string, tokenExpiration?:Date) {
    this.username.next(username);
    this.password.next(password);
    if (token) this.token.next(token);
    if (tokenExpiration) this.tokenExpiration.next(tokenExpiration);
  }

  public logout() {
    this.setUsernameAndPassword(null, null);
    this.token.next(null);
    this.tokenExpiration.next(null);
  }

  public getToken() {
    if (this.token.getValue() && new Date() < this.tokenExpiration.getValue()){
      return Promise.resolve(this.token.getValue());
    }
    else {
      return this.login();
    }
  }

  public login() {
      return new Promise((resolve, reject) => {
          Observable.ajax({
            url: AuthApiService.url,
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: {
              grant_type: 'password',
              username: this.username.getValue(),
              password: this.password.getValue(),
              client_id: "angular",
              client_secret: "angular"
            }
          }).subscribe((data) => { 
            this.tokenExpiration.next(Date.now() + data.response.expires_in);
            this.token.next(data.response.access_token);
            resolve(data.response.access_token);
          }, err => {
            this.logout();
            reject(err);
        });
      });
  }
}
