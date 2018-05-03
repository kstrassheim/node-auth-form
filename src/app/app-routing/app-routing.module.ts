import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component'
import { RegistrationComponent } from '../registration/registration.component'

const routes: Routes = [
  {
    path: 'registration',
    component: RegistrationComponent,
  },
  {
      path: '',
      component: LoginComponent,
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
