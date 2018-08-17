import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { ReadKeyExpr } from '@angular/compiler';

export interface ITokenResponse {
  token:string;
  expires:number;
}

@Injectable()
export class AuthApiService {

  private static url = "https://nodeauthweb.azurewebsites.net/auth/login";

  protected username = new BehaviorSubject<string>(null);
  public readonly username$ = this.username.asObservable();
  protected password = new BehaviorSubject<string>(null);
  public readonly password$ = this.password.asObservable();
  protected token = new BehaviorSubject<string>(null);
  public readonly token$ = this.token.asObservable();
  protected tokenExpiration= new BehaviorSubject<number>(null);
  public readonly tokenExpiration$ = this.tokenExpiration.asObservable();
  //public redirectUrl = new BehaviorSubject<string>(null);

  public readonly onLoggedIn = new Subject<string>();

  public setUsernameAndPassword(username:string, password:string, token?:string, tokenExpiration?:number) {
    this.username.next(username);
    this.password.next(password);
    if (token) this.token.next(token);
    if (tokenExpiration) this.tokenExpiration.next(tokenExpiration);
    if (token) this.onLoggedIn.next(token);
  }

  public logout() {
    this.setUsernameAndPassword(null, null);
    this.token.next(null);
    this.tokenExpiration.next(null);
  }

  public async getToken() {
    try 
    {
      if (!this.token.getValue() || !this.tokenExpiration.getValue() || (Date.now() > this.tokenExpiration.getValue())) {
        await this.login();
      }
        
      return Promise.resolve(this.token.getValue());
    }
    catch(err){
      return Promise.reject(err);
    }
  }

  public async login():Promise<void> {
    try {
      let data = await this.sendLogin(this.username.getValue(), this.password.getValue());
      this.tokenExpiration.next((Date.now() + data.expires));
      this.token.next(data.token);
      this.onLoggedIn.next(data.token);
      return Promise.resolve();
    }
    catch(err) {
      this.logout();
      return Promise.reject(err);
    }
  }

  protected sendLogin(username:string, password:string):Promise<ITokenResponse> {
    return new Promise((resolve, reject) => {
      Observable.ajax({
        url: AuthApiService.url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: {
          grant_type: 'password',
          username: username,
          password: password,
          client_id: "angular",
          client_secret: "angular"
        }
      }).subscribe((data) => { 
        resolve(<ITokenResponse>{token:data.response.access_token, expires: parseInt(data.response.expires_in)});
      }, err => {
        reject(err);
    });
  });
  }
}
