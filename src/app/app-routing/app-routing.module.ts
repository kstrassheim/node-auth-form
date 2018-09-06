import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { LoginComponent } from '../login/login.component';
import { RegistrationComponent } from '../registration/registration.component';

const routes: Routes = [
  {
    path: 'registration',
    component: RegistrationComponent,
  },
  {
      path: 'login',
      component: LoginComponent,
  },
  {
      path: '',
      component: HomeComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
      RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
