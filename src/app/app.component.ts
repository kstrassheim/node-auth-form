import { Component, AfterViewInit } from '@angular/core';
import { Router, NavigationStart, NavigationCancel, NavigationEnd } from '@angular/router';
import { AuthApiService } from './services/auth-api.service';
import { LoggerService } from './services/logger.service';
import { CookieService } from 'angular2-cookie/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit {
  title = 'Usermanagement';
  public loading = false;
  public loggedOn = false;
  public username = '';
  public static publicRoutes = ['/registration', '/login'];
  constructor(private router: Router, public auth: AuthApiService, public log: LoggerService, private cookie:CookieService) {
    
    this.loadAuthDataFromCookie();

    auth.token$.subscribe(t => {
      this.loggedOn = t ? true : false; 
      cookie.put("token", t);
      //if (!this.loggedOn) this.router.navigateByUrl('/login');
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

  loadAuthDataFromCookie() {
    let u = this.cookie.get("username");
    let p = this.cookie.get("password");
    let t = this.cookie.get("token");
    let e = this.cookie.get("tokenExpiration");
    let te = e ? new Date(JSON.parse(e)): null;
    this.auth.setUsernameAndPassword(u, p, t, te);
    this.loggedOn = t ? true : false; 
  }

  ngAfterViewInit() {
    this.router.events
        .subscribe((event) => {
            if (event instanceof NavigationStart && !this.loading) {
                this.loading = true;
                // check login status and redirect to login page
                if (!AppComponent.publicRoutes.find(o => event.url == o) && !this.loggedOn) {
                  this.auth.redirectUrl.next(event.url);
                  this.router.navigateByUrl("/login");
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
