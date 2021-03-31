import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, MenuController, LoadingController, Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { TermsOfServicePage } from '../terms-of-service/terms-of-service.page';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy.page';
import { PasswordValidator } from '../validators/password.validator';
import { finalize } from 'rxjs/operators';
import { RegisterModalPage } from './modal/register-modal.page';
import { ToastController } from '@ionic/angular';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./styles/signup.page.scss'],
})
export class SignupPage implements OnInit {
  signupForm: FormGroup;
  matching_passwords_group: FormGroup;
  dataReturned: any;
  isSubmitted = false;
  subscribe: any;

  validation_messages = {
    fullname: [
      { type: 'required', message: 'Fullname is required.' },
      { type: 'minlength', message: 'Name is too short' },
    ],
    contact_no: [
      { type: 'required', message: 'Phone Number is required.' },
      { type: 'pattern', message: 'Phone Number must be numeric' },
      { type: 'minlength', message: 'Password must be at least 8 characters long.' },
      { type: 'maxlength', message: 'Password must be less than 13 characters long.' },
    ],
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' },
    ],
    password: [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' },
      { type: 'pattern', message: 'Password must be alphanumeric' },
    ],
    confirm_password: [{ type: 'required', message: 'Confirm password is required' }],
    matching_passwords: [{ type: 'areNotEqual', message: 'Password mismatch' }],
  };

  constructor(
    public router: Router,
    public modalController: ModalController,
    public menu: MenuController,
    private loadingCtrl: LoadingController,
    private http: HttpClient,
    private toast: ToastController,
    private globalService: GlobalService,
    private platform: Platform
  ) {
    this.matching_passwords_group = new FormGroup(
      {
        password: new FormControl(
          '',
          Validators.compose([Validators.minLength(6), Validators.required])
        ),
        confirm_password: new FormControl('', Validators.required),
      },
      (formGroup: FormGroup) => {
        return PasswordValidator.areNotEqual(formGroup);
      }
    );

    this.signupForm = new FormGroup({
      fullname: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.minLength(3)])
      ),
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ])
      ),
      contact_no: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(8),
          Validators.maxLength(13),
        ])
      ),
      matching_passwords: this.matching_passwords_group,
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

  async showPrivacyModal() {
    const modal = await this.modalController.create({
      component: PrivacyPolicyPage,
    });
    return await modal.present();
  }

  async showTermsModal() {
    const modal = await this.modalController.create({
      component: TermsOfServicePage,
    });
    return await modal.present();
  }

  async doSignup() {
    const postdata = this.signupForm.value;
    postdata.password = postdata.matching_passwords.password;
    postdata.confirm_password = postdata.matching_passwords.confirm_password;
    postdata.contact_no = '0' + postdata.contact_no;

    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');

    const loading = await this.loadingCtrl.create();
    await loading.present();
    this.http
      .post(
        this.globalService.getApiUrl() +
          'user/register?X-Api-Key=' +
          this.globalService.getGlobalApiKey(),
        postdata
      )
      .pipe(finalize(() => loading.dismiss()))
      .subscribe(
        (data) => {
          this.openModal(
            'Congratulations !!!',
            'You have registered successfully. Click button to get started'
          );
        },
        (err) => {
          //console.log('error: ', err);
          let message = '';
          if (err.error.message === undefined) { message = 'Permasalahan jaringan, mohon coba lagi.'; } else { message = err.error.message; }

          this.presentToast(message);
        }
      );
    // this.router.navigate(['app/categories']);
  }

  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000,
    });
    toast.present();
    this.isSubmitted = true;
  }

  doSignup1() {
    this.openModal('Testing', 'Testing');
  }

  async openModal(title, message) {
    const modal = await this.modalController.create({
      component: RegisterModalPage,
      componentProps: {
        title: title,
        message: message,
      },
    });

    modal.onDidDismiss().then((dataReturned) => {
      this.router.navigate(['auth/login']);
    });

    return await modal.present();
  }

  doFacebookSignup(): void {
    this.router.navigate(['app/categories']);
  }

  doGoogleSignup(): void {
    this.router.navigate(['app/categories']);
  }

  doTwitterSignup(): void {
    this.router.navigate(['app/categories']);
  }
}
