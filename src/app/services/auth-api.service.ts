import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { ReadKeyExpr } from '@angular/compiler';

@Injectable()
export class AuthApiService {

  private static baseUrl = "https://nodeauthweb.azurewebsites.net/auth";
  public onLoggedIn = new Subject<string>();

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

  public async setTokenIfValid(token:string) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        if (token) { 
          const valid = await this.sendTokenValidation(token);
          if (valid) this.onLoggedIn.next(token);
        }
        resolve();
      }
      catch(err) {
        this.errorLog(err);
        reject(err);
      }
    });
  }

  public async login(username:string, password:string) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const token = await this.sendLogin(username, password);
        await this.setTokenIfValid(token);
        resolve();
      }
      catch(err) {
        this.errorLog(err);
        reject(err);
      }
    });
  }

  protected async sendRegistration(username:string, password:string) {
    return new Promise<number>((resolve, reject) => {
      Observable.ajax({
        url: `${AuthApiService.baseUrl}/registerUser`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: {
          body: {
            username: username,
            password: password
          }
        }
      }).subscribe((data) => {
        const status = parseInt(data.response.status); 
        if (status == 0) reject(data.response.error);
        else resolve(status);
      }, (err) => {
        reject(err);
      });
    });
  }

  public async register(username:string, password:string) {
    return new Promise<number>(async (resolve, reject) => {
      try {
        const res = await this.sendRegistration(username, password);
        resolve(res)
      }
      catch(err) {
        this.errorLog(err);
        reject(err);
      }
    });
  }
}
