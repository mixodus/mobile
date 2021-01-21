import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController, LoadingController, NavController, Platform } from '@ionic/angular';
import { AuthenticationService } from '../services/auth/authentication.service';
import { GlobalService } from '../services/global.service';
import { HttpClient} from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';

const TOKEN_KEY = 'idstar-token';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: [
    './styles/login.page.scss',
    './styles/login.shell.scss'
  ]
})
export class LoginPage implements OnInit {
  isSubmitted: boolean = false;
  loginForm: FormGroup;
  remember:boolean = false;

  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ]
  };
  subscribe:any;

  constructor(
    public router: Router,
    public menu: MenuController,
    private authService : AuthenticationService,
    private loadingCtrl : LoadingController,
    private http: HttpClient,
    private storage : Storage,
    private toast : ToastController,
    private globalService : GlobalService,
    public navCtrl: NavController,
    public platform: Platform,
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ]))
    });
  }

  ngOnInit(): void {
    this.menu.enable(false);
    this.storage.get("rememberCheck").then((val) => {
      this.remember = val;
      if(this.remember){
        this.storage.get("rememberEmail").then((email) => {
          this.loginForm.controls["email"].setValue(email);
        })
        this.storage.get("rememberPassword").then((pass) => {
          this.loginForm.controls["password"].setValue(pass);
        })
      }
    })
    
    // this.storage.get("showIntro").then((result) => {
    //   if(result === null){
    //     this.router.navigate(['walkthrough']);
    //     this.storage.set("showIntro", true);
    //   }
    // })

  }

  ionViewWillEnter(): void {
    this.subscribe = this.platform.backButton.subscribe(() => {
      navigator["app"].exitApp();
    })
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
      friend_list: true
    }
  }

  ionViewDidLeave(){
    this.subscribe.unsubscribe();
  }

  async doLogin() {
    let formData = this.loginForm.value;
    this.storage.set("prevNavigation", true);
    let loading = await this.loadingCtrl.create();
    let postdata = {username:formData.email,password:formData.password}
    this.storage.set("rememberCheck", this.remember)
    if(this.remember){
      this.storage.set("rememberEmail", formData.email)
      this.storage.set("rememberPassword", formData.password)
    } else {
      this.storage.remove("rememberEmail")
      this.storage.remove("rememberPassword")
    }
    await loading.present();

    this.http.post(this.globalService.getApiUrl() + 'user/login?X-Api-Key='+this.globalService.getGlobalApiKey(),postdata).pipe(
        finalize(() => loading.dismiss())
      )
      .subscribe(data => {
        let value = Object["values"](data)
        this.storage.set("showIntro", true);
        this.authService.setSignIn(data);
        if(!value[2].user.job_title || value[2].user.job_title === ""){
          this.router.navigate(['getting-started'])
        } else {
          // this.router.navigate(['app/home']);
          this.navCtrl.setDirection('root');
          this.router.navigate(['/app']);
        }

      },  err => {
        let message = "";
        if(err.error.message === undefined) 
          message = "Permasalahan jaringan, mohon coba lagi.";
        else if(this.loginForm.get('email').hasError('required') && this.loginForm.get('password').hasError('required'))
          message = "Email and Password cannot be empty";
        else if(this.loginForm.get('email').hasError('required'))
          message = "Email cannot be empty";
        else if(this.loginForm.get('password').hasError('required'))
          message = "Password cannot be empty";
        else if(this.loginForm.get('email').hasError('pattern'))
          message = "Please enter a valid email";
        else 
         message = err.error.message;
        
         this.presentToast(message);
      });
    
  }
  doLogin1(){
    this.authService.setSignInManual();
    this.router.navigate(['app/home']);
  }
  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
    this.isSubmitted = true;
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
