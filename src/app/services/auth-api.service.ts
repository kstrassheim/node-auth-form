import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AuthApiService {

  private static baseUrl = 'https://nodeauthweb.azurewebsites.net/auth';
  public onLoggedIn = new Subject<string>();

  protected errorLog(err: string) {
    console.error(err);
  }

  protected async sendTokenValidation(token) {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        console.log('Validate token:', token);
        const params = {access_token: token};
        const searchParams = Object.keys(params).map((key) => {
          return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
        }).join('&');
        const result = await fetch(`${AuthApiService.baseUrl}/validate`, {
          method: 'POST',
          mode: 'cors',
          cache: 'no-cache',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: searchParams
        });
        const data = await result.json();
        console.log('Validate token result:', data);
        if (!data || !data.message) { throw new Error('Response is not valid'); }
        resolve(data.message.id > 0);
      } catch (err) {
        reject(err);
      }
    });
  }

  protected async sendLogin(username: string, password: string) {
    return new Promise<string>(async (resolve, reject) => {
      try {
        const params = {
          grant_type: 'password',
          username: username,
          password: password,
          client_id: 'angular',
          client_secret: 'angular'
        };
        const searchParams = Object.keys(params).map((key) => {
          return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
        }).join('&');
        const result = await fetch(`${AuthApiService.baseUrl}/login`, {
          method: 'POST',
          mode: 'cors',
          cache: 'no-cache',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: searchParams
        });
        const data = await result.json();
        if (!data) { throw new Error('Response is not valid'); }
        resolve(data.access_token);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async setTokenIfValid(token: string) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        if (token) {
          const valid = await this.sendTokenValidation(token);
          if (valid) { this.onLoggedIn.next(token); }
        }
        resolve();
      } catch (err) {
        this.errorLog(err);
        reject(err);
      }
    });
  }

  public async login(username: string, password: string) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const token = await this.sendLogin(username, password);
        await this.setTokenIfValid(token);
        resolve();
      } catch (err) {
        this.errorLog(err);
        reject(err);
      }
    });
  }

  protected async sendRegistration(username: string, password: string) {
    return new Promise<number>(async (resolve, reject) => {
      try {
        const params = {
          username: username,
          password: password
        };
        const searchParams = Object.keys(params).map((key) => {
          return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
        }).join('&');
        const result = await fetch(`${AuthApiService.baseUrl}/registerUser`, {
          method: 'POST',
          mode: 'cors',
          cache: 'no-cache',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: searchParams
        });
        const data = await result.json();
        if (!data) { throw new Error('Response is not valid'); }
        const status = parseInt(data.status, 10);
        if (status === 0) {
          reject(data.error);
        } else {
          resolve(status);
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  public async register(username: string, password: string) {
    return new Promise<number>(async (resolve, reject) => {
      try {
        const res = await this.sendRegistration(username, password);
        resolve(res);
      } catch (err) {
        this.errorLog(err);
        reject(err);
      }
    });
  }
}
