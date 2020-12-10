import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterPage } from './pages/register/register.page';
import { RegisterAndLoginComponent } from './register-and-login.component';
import { LoginPage } from './pages/login/login.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterAndLoginComponent,
    children: [
      {
        path: 'login',
        component: LoginPage,
      },
      {
        path: 'signup',
        component: RegisterPage,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrationAndLoginRoutingModule {}
