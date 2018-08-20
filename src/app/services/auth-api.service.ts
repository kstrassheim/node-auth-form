import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { ReadKeyExpr } from '@angular/compiler';

@Injectable()
export class AuthApiService {

  private static baseUrl = "https://nodeauthweb.azurewebsites.net/auth";

  protected token = new BehaviorSubject<string>(null);
  public readonly token$ = this.token.asObservable();

  protected errorLog(err:string) { 
    console.error(err); 
  }

  protected async sendTokenValidation(token) {
    return new Promise<boolean>((resolve, reject) => {
      Observable.ajax({
        url: `${AuthApiService.baseUrl}/validate`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: {
          access_token: token.getValue(),
        }
      }).subscribe((data) => { 
        resolve(data.response.id > 0);
      }, (err) => {
        reject(err);
      });
    });
  }
  
  protected async sendLogin(username:string, password:string) {
    return new Promise<string>((resolve, reject) => {
      Observable.ajax({
        url: `${AuthApiService.baseUrl}/login`,
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
        resolve(data.response.access_token);
      }, (err) => {
        reject(err);
      });
    });
  }

  public logout() { this.token.next(null); }

  public async setTokenIfValid(token) {
    try {
      const valid = await this.sendTokenValidation(token);
      if (valid) this.token.next(token);
    }
    catch(err) {
       this.errorLog(err);
    }
  }

  public async login(username:string, password:string) {
    try {
      const token = await this.sendLogin(username, password);
      await this.setTokenIfValid(token);
    }
    catch(err) {
       this.errorLog(err);
    }
  }
}
