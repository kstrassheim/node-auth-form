import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as $ from 'jquery'

@Injectable()
export class AuthApiService {

  private url:string = "https://nodeauthweb.azurewebsites.net/auth/login";

  private username$ = new BehaviorSubject<string>("");
  //username = this.username$.asObservable();

  private password$ = new BehaviorSubject<string>("");
  //password = this.password.asObservable();

  private token$ = new BehaviorSubject<string>("");
  //token = this.token$.asObservable();

  // token: number;
  // token$: Observable<number>;

  changeToken(tokenNext: string) {
    
  }

  public login(username:string, password:string) {
    return new Promise((resolve, reject) => {
      var paramJQuery = {
        url: this.url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          grant_type: 'password',
          username: username,
          password: password,
          client_id: "angular",
          client_secret: "angular"
        }
      };
  
      var paramObservable = {
        url: this.url,
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
      };
  
      $.ajax(paramJQuery).done((r) => {
        this.username$.next(username);
        this.password$.next(password);

        var t = r.access_token;
        var expires = r.expires_in;
        this.token$.next(r.access_token);
        resolve(r.access_token);
      }).fail((err) => {
        console.error(err);
        reject(err);
      });
    });
  }

  constructor() { 

  }

}
