import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationCancel, NavigationEnd } from '@angular/router';
import { URLSearchParams } from "@angular/http";
import { AuthApiService } from './services/auth-api.service';
import { LoggerService } from './services/logger.service';
import { CookieService } from 'ngx-cookie';
import { decode } from '@angular/router/src/url_tree';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewInit {
  title = 'Node Auth Form';
  public loading = false;
  public loggedOn = false;
  public username = '';
  public static publicRoutes = ['/registration', '/login'];

  private redirectUrl:string = null;

  constructor(private router: Router, public auth: AuthApiService, public log: LoggerService, private cookie:CookieService) {
    this.saveRedirectUrlFromQueryParameters();

    // get redirect url from params and save it
    auth.onLoggedIn.subscribe(this.onLoggedIn.bind(this));
    this.loadAuthDataFromCookie();

    auth.token$.subscribe(t => {
      this.loggedOn = t ? true : false; 
      cookie.put("token", t);
    });

    auth.username$.subscribe(u=>{
      this.username = u; 
      cookie.put("username", u);
    });

    auth.password$.subscribe(p=>{
      cookie.put("password", p);
    });

    auth.tokenExpiration$.subscribe(e=>{
      let es = JSON.stringify(e);
      cookie.put("tokenExpiration", JSON.stringify(e));
    });

  }

  saveRedirectUrlFromQueryParameters() {
    let sp = window.location.href.split('?');
    if (sp.length > 1) {
      sp = sp[1].split('&');
      if (sp.length > 0) {
        sp = sp.filter((s) => s.toLowerCase().startsWith('redirecturl='));
        if (sp.length > 0) {
          sp = sp[0].split('=');
          if (sp.length > 1) {
            this.redirectUrl = decodeURIComponent(sp[1]);
          } 
        }
      }
    }
  }

  onLoggedIn(token:string) {
    if ( this.redirectUrl) {
      if (this.redirectUrl && !this.redirectUrl.toLowerCase().startsWith('http')) {
        this.router.navigateByUrl(this.redirectUrl);
        this.redirectUrl = null;
      }
      else {
        // navigate back to original site
        window.location.href = this.redirectUrl.replace('{0}', token);
      }
    }
  }

  loadAuthDataFromCookie() {
    let u = this.cookie.get("username");
    let p = this.cookie.get("password");
    let t = this.cookie.get("token");
    let e = this.cookie.get("tokenExpiration");
    let te = e ? parseInt(e): null;
    this.auth.setUsernameAndPassword(u, p, t, te);
    this.loggedOn = t ? true : false; 
    this.onLoggedIn(t);
  }

  ngOnInit() {
   
  }

  ngAfterViewInit() {
    this.router.events
        .subscribe((event) => {
            if (event instanceof NavigationStart && !this.loading) {
                this.loading = true;
                let pureUrl = event.url.split('?')[0];
                // check login status and redirect to login page
                if (!AppComponent.publicRoutes.find(o => pureUrl == o) && !this.loggedOn) {
                  if (!this.redirectUrl) {
                    this.redirectUrl = event.url;
                  }
                  //this.auth.redirectUrl.next(event.url);
                  this.router.navigateByUrl('/login');
                }
            }
            else if (
                event instanceof NavigationEnd || 
                event instanceof NavigationCancel
                ) {
                this.loading = false;
            }
        });
  }
}
