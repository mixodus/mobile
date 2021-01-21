import { Component, OnInit, PlatformRef } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { SplashScreen } = Plugins;
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { AuthenticationService } from './services/auth/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { NavController, AlertController, Platform, ToastController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
// import { NetworkServiceProviderService } from './network-service-provider.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: [
    // './side-menu/styles/side-menu.scss',
    // './side-menu/styles/side-menu.shell.scss',
    // './side-menu/styles/side-menu.responsive.scss'
  ]
})
export class AppComponent implements OnInit {
  sessionUser = {fullname : 'Hendra Ramdhan', job_title: 'Software Developer'};

  appPages = [
    {
      title: 'Categories',
      url: '/app/categories',
      icon: './assets/sample-icons/side-menu/categories.svg'
    },
    {
      title: 'Profile',
      url: '/app/user',
      icon: './assets/sample-icons/side-menu/profile.svg'
    },
    {
      title: 'Contact Card',
      url: '/contact-card',
      icon: './assets/sample-icons/side-menu/contact-card.svg'
    },
    {
      title: 'Notifications',
      url: '/app/notifications',
      icon: './assets/sample-icons/side-menu/notifications.svg'
    }
  ];
  accountPages = [
    {
      title: 'Log In',
      url: '/auth/login',
      icon: './assets/sample-icons/side-menu/login.svg'
    },
    {
      title: 'Sign Up',
      url: '/auth/signup',
      icon: './assets/sample-icons/side-menu/signup.svg'
    },
    {
      title: 'Tutorial',
      url: '/walkthrough',
      icon: './assets/sample-icons/side-menu/tutorial.svg'
    },
    {
      title: 'Getting Started',
      url: '/getting-started',
      icon: './assets/sample-icons/side-menu/getting-started.svg'
    },
    {
      title: '404 page',
      url: '/page-not-found',
      icon: './assets/sample-icons/side-menu/warning.svg'
    },
    {
      title: 'Update App',
      url: '/update-app',
      icon: './assets/sample-icons/side.menu/update.png'
    }
  ];

  sidePages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Referral',
      url: '/app/referral',
      icon: 'wallet',
      mode: 'md'
    },
    {
      title: 'Change Password',
      url: '/app/user/change-password',
    },
    {
      title: 'Sign Out',
      url: 'auth/login',
      color: 'red'
    }
  ];
  textDir = 'ltr';

  disconnectSubscription: any;

  constructor(
    public translate: TranslateService,
    private auth: AuthenticationService,
    private router: Router,
    private storage: Storage,
    private http: HttpClient,
    private navCtrl: NavController,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private platform: Platform,
    // private netService: NetworkServiceProviderService,
    private network: Network,
    private toast: ToastController,
  ) {
    this.initializeApp();
    this.setLanguage();
  }

  async initializeApp() {
    try {
      await SplashScreen.hide();
    } catch (err) {
      console.log('This is normal in a browser', err);
    }


    // this.auth.authState.subscribe(state => {
    //   if (state) {

    //     this.router.navigate(['app/home']);


    //   } else {
    //     this.router.navigate(['auth/login']);
    //   }
    // });


  }

  setLanguage() {
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use('en');

    // this is to determine the text direction depending on the selected language
    // for the purpose of this example we determine that only arabic and hebrew are RTL.
    // this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
    //   this.textDir = (event.lang === 'ar' || event.lang === 'iw') ? 'rtl' : 'ltr';
    // });
  }
  ngOnInit() {
    // this.platform.ready().then((x)=> {
    //   this.netService.setSubscriptions();
    // })
    // var count = 0;
    // const dataSource: Observable<HomeModel> = this.homeService.getProfileDataSource();
    // let profileDataStore: DataStore<HomeModel> = this.homeService.getProfileStore(dataSource, true);
    // this.disconnectSubscription = this.network.onDisconnect().subscribe(() => {
    //   this.presentToast('You have been disconnected');
    // });
  }

  redirect(url: string) {
    this.navCtrl.navigateForward(url);
  }
  signOut() {
    this.confirm();
  }
  async confirm() {
    const alert = await this.alertController.create({
      header: 'Confirm',
      message: 'Apakah kamu yakin ingin keluar ?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
        }, {
          text: 'Ya',
          handler: (blah) => {
            this.auth.signOut();
          }
        }
      ]
    });

    await alert.present();
  }

  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
  gotoChangePassword() {
    this.router.navigateByUrl('app/user/change-password');
  }
  gotoReferral() {
    this.router.navigateByUrl('app/referral');
  }

}
