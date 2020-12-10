import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, MenuController, ModalController, Platform, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../services/global.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: [
    './styles/forgot-password.page.scss'
  ]
})

export class ForgotPasswordPage implements OnInit {
  forgotPasswordForm: FormGroup;
  subscribe: any;

  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ]
  };

  constructor(
    public router: Router,
    private _modalController: ModalController,
    public alertController: AlertController,
    public menu: MenuController,
    private loadingCtrl: LoadingController,
    private http: HttpClient,
    private toast: ToastController,
    private globalService: GlobalService,
    private platform: Platform,
  ) {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
      ]))
    });
  }

  ngOnInit(): void {
    this.menu.enable(false);
  }

  ionViewWillEnter(): void {
    this.subscribe = this.platform.backButton.subscribe(() => {
      this.router.navigateByUrl('auth/login');
    });
  }

  ionViewDidLeave() {
    this.subscribe.unsubscribe();
  }

  async recoverPassword() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    const formData = this.forgotPasswordForm.value;

    const url = this.globalService.getApiUrl() + 'user/reset_password?X-Api-Key=' + this.globalService.getGlobalApiKey();
    this.http.post(url, formData).pipe(
      finalize(() => loading.dismiss())
    )
      .subscribe(data => {
        // this.presentToast(data['message']);
        this.presentAlert(data['message']);
      }, err => {

        let message = '';
        if (err.error.message === undefined) {
          message = 'Network problem, please try again !';
        } else {
          message = err.error.message;
        }

        this.presentToast(message);
      });
  }

  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      message: `<div class="message-body">
                    <p class="title">Cek Email Anda</p>
                    <p class="content">${message}</p>
                </div>`,
      cssClass: 'idstar-custom-alert',
      buttons: [
        {
          cssClass: 'idstar-custom-alert-action',
          text: 'Kembali Ke Login',
          handler: () => {
            this.router.navigate(['auth/login']);
          },
        },
      ],
    });

    await alert.present();
  }
}
