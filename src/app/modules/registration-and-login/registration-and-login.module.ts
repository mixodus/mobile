import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationAndLoginRoutingModule } from './registration-and-login-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RegisterPage } from './pages/register/register.page';
import { RegisterAndLoginComponent } from './register-and-login.component';
import { ComponentsModule } from '../../components/components.module';
import { LoginPage } from './pages/login/login.page';
import { RegisterModalPage } from '../../signup/modal/register-modal.page';
import { TermsOfServicePage } from '../../terms-of-service/terms-of-service.page';
import { PrivacyPolicyPage } from '../../privacy-policy/privacy-policy.page';

@NgModule({
  declarations: [
    RegisterAndLoginComponent,
    RegisterPage,
    LoginPage,
    TermsOfServicePage,
    PrivacyPolicyPage,
    RegisterModalPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RegistrationAndLoginRoutingModule,
    ComponentsModule,
  ],
  entryComponents: [TermsOfServicePage, PrivacyPolicyPage, RegisterModalPage]
})
export class RegistrationAndLoginModule {}
