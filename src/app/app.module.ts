import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing/app-routing.module';

import { AppComponent } from './app.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { CollapseModule, BsDropdownModule  } from 'ngx-bootstrap';
import { AuthApiService } from './services/auth-api.service';


@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CollapseModule.forRoot(), BsDropdownModule.forRoot(),
    AppRoutingModule
  ],
  providers: [AuthApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
