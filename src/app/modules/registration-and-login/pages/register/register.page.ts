import { Component, OnInit } from '@angular/core';
import { IPage } from '../../../../core/interfaces/component-base/IPage';
import { FormBuilder, Validators } from '@angular/forms';
import { LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { RegisterModalPage } from '../../../../signup/modal/register-modal.page';
import { PrivacyPolicyPage } from '../../../../privacy-policy/privacy-policy.page';

import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from '../../../../services/global.service';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { TermsOfServicePage } from '../../../../terms-of-service/terms-of-service.page';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit, IPage {
  isPolicyTermsChecked = false;
  isPolicyTermsValid = true;

  constructor(
    private _fb: FormBuilder,
    private _loadingController: LoadingController,
    private _modalController: ModalController,
    private _toastController: ToastController,
    private _router: Router,
    private _http: HttpClient,
    private _globalService: GlobalService,
    private _platform: Platform
  ) {
  }

  pageTitle = 'Welcome - Register an Account';

  backgroundImage = 'url(assets/bg/bg1.png)';

  brandLogo = 'assets/new-assets/logo.png';
  brandAlt = 'ONE';

  // validations messages collecion
  validation_messages = {
    fullname: [
      { type: 'required', message: 'Nama Lengkap dibutuhkan.' },
      { type: 'minlength', message: 'Nama terlalu pendek.' },
    ],
    contact_no: [
      { type: 'required', message: 'Nomor Telepon dibutuhkan.' },
      { type: 'pattern', message: 'Nomor Telepon harus berupa angka.' },
      { type: 'minlength', message: 'Nomor Telepon minimal 8 karakter.' },
      { type: 'maxlength', message: 'Nomor Telepon maksimal 13 karakter.' },
    ],
    email: [
      { type: 'required', message: 'Email dibutuhkan.' },
      { type: 'pattern', message: 'Mohon masukkan Email dengan benar.' }
    ],
    password: [
      { type: 'pattern', message: 'Password harus alphanumeric.' },
      { type: 'required', message: 'Password dibutuhkan.' },
      { type: 'minlength', message: 'Password minimal 5 karakter.' },
    ],
    confirm_password: [{ type: 'required', message: 'Konfirmasi Password dibutuhkan.' }],
  };

  // main form
  registerForm = this._fb.group({
    fullname: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
    email: ['',
      Validators.compose(
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
        ])
    ],
    contact_no: [
      '',
      Validators.compose([
        Validators.pattern('^[0-9]*$'),
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(13),
      ]),
    ],
    password: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(5)
      ]),
    ],
    confirm_password: ['', Validators.required],
  });

  notValid = false;

  backButtonSubscription: Subscription;

  ngOnInit() {
  }

  ionViewWillEnter(): void {
    this.backButtonSubscription = this._platform.backButton.subscribe(() => {
      this._router.navigateByUrl('auth/login');
    });
  }

  ionViewDidLeave() {
    this.backButtonSubscription.unsubscribe();
  }

  isPasswordAlphanumeric() {
    const letter = /[a-zA-Z]/;
    const number = /[0-9]/;
    const pwd = this.registerForm.get('password').value;
    // console.log('number.test(pwd): ', number.test(pwd));
    // console.log('letter.test(pwd): ', letter.test(pwd));

    return number.test(pwd) && letter.test(pwd);
  }

  isPasswordMatch() {
    const password = this.registerForm.get('password').value;
    const passwordConfirmation = this.registerForm.get('confirm_password').value;

    // tslint:disable-next-line:triple-equals
    return password == passwordConfirmation;
  }

  isFormValid() {
    console.log('this.isPasswordAlphanumeric(): ', this.isPasswordAlphanumeric());
    return this.registerForm.valid && this.isPasswordMatch() && this.isPasswordAlphanumeric() && this.isPolicyTermsChecked;
  }

  async openModal(title, messageA, messageB) {
    const modal = await this._modalController.create({
      component: RegisterModalPage,
      componentProps: {
        title: title,
        messageA: messageA,
        messageB: messageB
      },
    });

    modal.onDidDismiss().then((dataReturned) => {
      this._router.navigate(['auth/login']);
    });

    return await modal.present();
  }

  async presentToast(message) {
    const toast = await this._toastController.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }

  async showPrivacyPolicy() {
    const modal = await this._modalController.create({
      component: PrivacyPolicyPage,
      componentProps: {
        title: 'Privacy Policy',
      },
    });

    await modal.present();
  }

  async showTermsOfUse() {
    const modal = await this._modalController.create({
      component: TermsOfServicePage,
      componentProps: {
        title: 'Syarat Penggunaan',
      },
    });

    await modal.present();
  }

  async onSubmit() {
    console.log('isPolicyTermsChecked: ', this.isPolicyTermsChecked);
    const formValue = this.registerForm.value;
    console.log('this.registerForm.value: ', this.registerForm.value);
    console.log('this.registerForm.get(\'email\'): ', this.registerForm.get('email'));
    console.log('validation: ', this.registerForm.get('password'));
    console.log(formValue);
    this.isPolicyTermsValid = this.isPolicyTermsChecked;

    if (this.isFormValid()) {
      this.notValid = false;
      const loading = await this._loadingController.create();
      await loading.present();

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Api-Key': this._globalService.getGlobalApiKey() });
      const options = { headers: headers };

      const registerUserEndpoint = this._globalService.getApiUrl() + 'user/register';

      this._http
        .post(
          registerUserEndpoint,
          formValue,
          options
        )
        .pipe(finalize(() => loading.dismiss()))
        .subscribe(
          (data) => {
            this.openModal(
              'Selamat!',
              'Akunmu berhasil terdaftar.',
              'Silahkan verifikasi emailmu untuk masuk.',
            );
          },
          (err) => {
            let message = '';
            if (err.error.message === undefined) {
              message = 'Permasalahan jaringan, mohon coba lagi.';
            } else {
              message = err.error.message;
            }

            this._toastController.dismiss();

            this.presentToast(message);
          }
        );
    } else {
      this.notValid = true;
    }
  }
}
