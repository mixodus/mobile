import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController, ModalController, LoadingController, ToastController, NavController } from '@ionic/angular';
import { PasswordValidator } from '../../../validators/password.validator';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../../services/global.service';
import { finalize } from 'rxjs/operators';
import { AuthenticationService } from '../../../services/auth/authentication.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  correctPassword: boolean = false;
  changePasswordForm: FormGroup;
  matching_passwords_group: FormGroup;
  match_previous_password: FormGroup;
  validation_messages = {
    'password': [
      { type: 'required', message: 'Password is required.' },
    ],
    'newpassword': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ],
    'confirm_newpassword': [
      { type: 'required', message: 'Confirm password is required' }
    ],
    'matching_passwords': [
      { type: 'areNotEqual', message: 'Password mismatch' }
    ]
  };

  constructor(
    public navCtrl: NavController,
    public modalController: ModalController,
    public menu: MenuController,
    private loadingCtrl: LoadingController,
    private http: HttpClient,
    private toast: ToastController,
    private globalService: GlobalService,
    private auth: AuthenticationService,
  ) {
    this.matching_passwords_group = new FormGroup({
      'newpassword': new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required,
      ])),
      'confirm_newpassword': new FormControl('', Validators.required)
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areNotEqual(formGroup);
    });

    this.changePasswordForm = new FormGroup({
      'password': new FormControl('', Validators.compose([
        Validators.required,
      ])),
      'matching_passwords': this.matching_passwords_group,
    });
  };

  ngOnInit(): void {
    this.menu.enable(false);
  }

  async changePassword() {
    let loading = await this.loadingCtrl.create();
    await loading.present();

    let formData = this.changePasswordForm.value
    formData.newpassword = formData.matching_passwords.newpassword;
    formData.confirm_newpassword = formData.matching_passwords.confirm_newpassword;

    let token = this.auth.token
    let url = this.globalService.getApiUrl() + 'api/profile/change_password?X-Api-Key=' + this.globalService.getGlobalApiKey() + '&X-Token=' + token;
    if (this.changePasswordForm.controls.password.value === this.matching_passwords_group.controls.newpassword.value && this.changePasswordForm.controls.password.value !== '') {
      this.presentToast("New password cannot be the same with old password");
      loading.dismiss();
    } else {
      this.http.post(url, formData).pipe(
        finalize(() => loading.dismiss())
      )
        .subscribe(data => {

          this.navCtrl.pop();
        }, err => {

          let message = "";
          if (err.error.message === undefined) {
            message = "Permasalahan jaringan, mohon coba lagi.";
          } else {
            message = err.error.message;
          }
          this.presentToast(message);
        });
    }
  }

  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

}
