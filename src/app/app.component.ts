import { Component, AfterViewInit, OnChanges } from '@angular/core';
import {  Router, NavigationStart, NavigationCancel, NavigationEnd } from '@angular/router';
import { AuthApiService } from './services/auth-api.service';
import { LoggerService } from './services/logger.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit, OnChanges {
  title = 'app';
  public loading = false;
  public loggedOn = false;
  public username = '';
  public static publicRoutes = ['/registration', '/login'];
  constructor(private router: Router, public auth:AuthApiService, public log:LoggerService) {
    auth.token$.subscribe(t => {
      this.loggedOn = t ? true : false; 
      //if (!this.loggedOn) this.router.navigateByUrl('/login');
    });
    auth.username$.subscribe(u=>this.username = u);
  }

  ngOnChanges() {
    
  }

  ngAfterViewInit() {
    this.router.events
        .subscribe((event) => {
            if(event instanceof NavigationStart && !this.loading) {
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
