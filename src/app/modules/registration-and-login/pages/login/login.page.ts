import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController, LoadingController, NavController, Platform, AlertController } from '@ionic/angular';
import { AuthenticationService } from '../../../../services/auth/authentication.service';
import { GlobalService } from '../../../../services/global.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';

const TOKEN_KEY = 'idstar-token';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./styles/login.page.scss', './styles/login.shell.scss'],
})
export class LoginPage implements OnInit {
  isSubmitted = false;
  loginForm: FormGroup;
  remember = false;

  validation_messages = {
    email: [
      { type: 'required', message: 'Email dibutuhkan.' },
      { type: 'pattern', message: 'Masukkan Email dengan benar.' },
    ],
    password: [
      { type: 'required', message: 'Password dibutuhkan.' },
    ],
  };
  subscribe: any;

  constructor(
    public router: Router,
    public menu: MenuController,
    private authService: AuthenticationService,
    private loadingCtrl: LoadingController,
    private http: HttpClient,
    private storage: Storage,
    private toast: ToastController,
    private globalService: GlobalService,
    public navCtrl: NavController,
    public platform: Platform,
    public alertController: AlertController
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ])
      ),
      password: new FormControl(
        '',
        Validators.compose([
          Validators.required,
        ])
        // Validators.compose([Validators.minLength(6), Validators.required])
      ),
    });
  }

  ngOnInit(): void {
    this.menu.enable(false);
    this.storage.get('rememberCheck').then((val) => {
      this.remember = val;
      if (this.remember) {
        this.storage.get('rememberEmail').then((email) => {
          this.loginForm.controls['email'].setValue(email);
        });
        this.storage.get('rememberPassword').then((pass) => {
          this.loginForm.controls['password'].setValue(pass);
        });
      }
    });
    // this.storage.get("showIntro").then((result) => {
    //   if(result === null){
    //     this.router.navigate(['walkthrough']);
    //     this.storage.set("showIntro", true);
    //   }
    // })
  }

  ionViewWillEnter(): void {
    this.subscribe = this.platform.backButton.subscribe(() => {
      navigator['app'].exitApp();
    });
    this.globalService.refreshFlag = {
      home: true,
      job: true,
      jobApp: true,
      job_detail: true,
      profile: true,
      workExp: true,
      education: true,
      project: true,
      referral: true,
      challenge: true,
      challenge_detail: true,
      leaderboard: true,
      level: true,
      friend_request: true,
      friend_list: true,
    };
  }

  ionViewDidLeave() {
    this.subscribe.unsubscribe();
  }

  async doLogin() {
    const formData = this.loginForm.value;
    this.storage.set('prevNavigation', true);
    const loading = await this.loadingCtrl.create();
    const postdata = { username: formData.email, password: formData.password };

    const body = new FormData();
    body.append('username', formData.email);
    body.append('password', formData.password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this.globalService.getGlobalApiKey()
    });
    const options = { headers: headers };

    this.storage.set('rememberCheck', this.remember);
    if (this.remember) {
      this.storage.set('rememberEmail', formData.email);
      this.storage.set('rememberPassword', formData.password);
    } else {
      this.storage.remove('rememberEmail');
      this.storage.remove('rememberPassword');
    }
    await loading.present();

    this.http
      .post(
        this.globalService.getApiUrl() +
        'user/login',
        postdata, options
      )
      .pipe(finalize(() => loading.dismiss()))
      .subscribe(
        (data) => {
          const value = Object['values'](data);
          this.storage.set('showIntro', true);
          this.authService.setSignIn(data);
          if (!value[2].user.job_title || value[2].user.job_title === '') {
            this.router.navigate(['getting-started']);
          } else {
            // this.router.navigate(['app/home']);
            this.navCtrl.setDirection('root');
            this.router.navigate(['/app']);
          }
        },
        (err) => {
          let message = '';
          if (err.error.message === undefined) {
            message = 'Permasalahan jaringan, mohon coba lagi.';
          } else if (
            this.loginForm.get('email').hasError('required') &&
            this.loginForm.get('password').hasError('required')
          ) {
            message = 'Email and Password cannot be empty';
          } else if (this.loginForm.get('email').hasError('required')) {
            message = 'Email cannot be empty';
          } else if (this.loginForm.get('password').hasError('required')) {
            message = 'Password cannot be empty';
          } else if (this.loginForm.get('email').hasError('pattern')) {
            message = 'Please enter a valid email';
          } else {
            message = err.error.message;
          }

          if (err.error.isVerified === false) {
            this.presentAlert();
            //console.log('masuk present alert email verified');
          } else {
            this.presentToast(message);
          }
        }
      );
  }

  doLogin1() {
    this.authService.setSignInManual();
    this.router.navigate(['app/home']);
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      message: 'Email Anda belum terverifikasi, apakah Anda ingin dikirimkan link verifikasi? ',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel'
        }, {
          text: 'Ya',
          handler: () => {
            this.sendEmailVerificationLink();
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlertNotif(message) {
    const alert = await this.alertController.create({
      message: message,
      buttons: ['Baik']
    });

    await alert.present();
  }

  async sendEmailVerificationLink() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    const rawBody = {
      'email': this.loginForm.value.email
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this.globalService.getGlobalApiKey()
    });
    const options = { headers: headers };

    const url = this.globalService.getApiUrl() + 'api/user/request-verify';
    this.http.post(url, rawBody, options).pipe(
      finalize(() => loading.dismiss())
    )
      .subscribe(data => {
        //console.log('data: ', data['message']);
        // this.presentToast(data['message']);
        this.presentAlertNotif(data['message']);
      }, err => {

        let message = '';
        if (err.error.message === undefined) {
          message = 'Permasalahan jaringan, mohon coba lagi.';
        } else {
          message = err.error.message;
        }

        this.presentToast(message);
      });
  }

  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000,
    });
    toast.present();
    this.isSubmitted = true;
  }

  handleLoginAsGuestClick() {
    this.authService.changeIsInitialLogin(true);
  }

  // goToForgotPassword(): void {
  //   console.log('redirect to forgot-password page');
  // }

  // doFacebookLogin(): void {
  //   console.log('facebook login');
  //   this.router.navigate(['app/categories']);
  // }

  // doGoogleLogin(): void {
  //   console.log('google login');
  //   this.router.navigate(['app/categories']);
  // }

  // doTwitterLogin(): void {
  //   console.log('twitter login');
  //   this.router.navigate(['app/categories']);
  // }
}
