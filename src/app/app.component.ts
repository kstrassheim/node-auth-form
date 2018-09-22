import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationCancel, NavigationEnd } from '@angular/router';
import { URLSearchParams } from '@angular/http';
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
  public static publicRoutes = ['/registration', '/login'];
  title = 'Node Auth Form';
  public loading = false;
  public loggedOn = false;
  public username = '';
  private redirectUrl: string = null;

  constructor(private router: Router, public auth: AuthApiService, public log: LoggerService, private cookie: CookieService) {
    this.auth.onLoggedIn.subscribe(this.onLoggedIn.bind(this));
  }

  public ngOnInit() {
    console.log('App - OnInit');
    this.saveRedirectUrlFromQueryParameters();
    // get token from cookie
    this.auth.setTokenIfValid(this.cookie.get('token'));
  }

  public ngAfterViewInit() {
    console.log('App - After Init');
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart && !this.loading) {
          this.loading = true;
          const pureUrl = event.url.split('?')[0];
          // check login status and redirect to login page
          if (!AppComponent.publicRoutes.find(o => pureUrl === o) && !this.loggedOn) {
            if (!this.redirectUrl) {
              this.redirectUrl = event.url;
            }
            this.router.navigateByUrl('/login');
          }
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        this.loading = false;
      }
    });
  }

  logout() {
    this.cookie.remove('token');
    this.loggedOn = false;
  }

  protected getWindowLocationHref() { return window.location.href; }

  protected setWindowLocationHref(url: string) { window.location.href = url; }

  protected saveRedirectUrlFromQueryParameters() {
    let sp = this.getWindowLocationHref().split('?');
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

  protected onLoggedIn(token: string) {
    this.cookie.put('token', token);
    this.loggedOn = token ? true : false;
    console.log(`Logged in, redirectUrl`, this.redirectUrl);
    if (this.redirectUrl) {
      if (this.redirectUrl && !this.redirectUrl.toLowerCase().startsWith('http')) {
        this.log.logInfo(`Navigate back to original site by router.navigateByUrl: ${this.redirectUrl}`, false);
        this.router.navigateByUrl(this.redirectUrl);
        this.redirectUrl = null;
      } else {
        // navigate back to original site
        this.log.logInfo(`Navigate back to original site window.location.href: ${this.redirectUrl}`, false);
        this.setWindowLocationHref(this.redirectUrl.replace('{0}', token));
      }
    }
  }
}
