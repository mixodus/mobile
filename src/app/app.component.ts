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
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { HomeService} from './home/home.service';
import { Market } from '@ionic-native/market/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';

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
  AppName:string;
  PackageName:string;
  VersionCode:string|number;
  VersionNumber:string;
  AppNewestVer:string|number;

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
  onesignalStatus: boolean;

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
    private oneSignal: OneSignal,
    private homeService: HomeService,
    private market: Market,
    private appVersion: AppVersion,
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
    this.homeService.getAppNewestVersion().pipe().subscribe( (data:any) =>{
      this.AppNewestVer = data.data;
    });
    // this.market.open('com.onetalents.mobile');
    // this.checkAppVersion();

    //this.oneSignalInit();
    // this.auth.authState.subscribe(state => {
    //   if (state) {
    //     this.router.navigate(['app/home']);
    //   } else {
    //     this.router.navigate(['auth/login']);
    //   }
    // });
  }

  checkAppVersion(){
    this.platform.ready().then(() => {
      this.appVersion.getAppName().then(value => {
        this.AppName = value;
        console.log('AppName:' + this.AppName)
      }).catch(err => {
        alert(err);
      });
      this.appVersion.getPackageName().then(value => {
        this.PackageName = value;
        console.log('PackageName:' + this.PackageName)
      }).catch(err => {
        alert(err);
      });
      this.appVersion.getVersionCode().then(value => {
        this.VersionCode = value;
        console.log('VersionCode:' + this.VersionCode);
        //Check App version or not update to market
        if(this.VersionCode != this.AppNewestVer){
          this.updateAlert();
        }
      }).catch(err => {
        alert(err);
      });
      this.appVersion.getVersionNumber().then(value => {
        this.VersionNumber = value;
        console.log('VersionNumber:' + this.VersionNumber)
      }).catch(err => {
        alert(err);
      });
    })
  }

  async updateAlert(){
    const alert = await this.alertController.create({
      header: 'New Update!',
      message: 'Please update to use new features!',
      buttons: [
        {
          text: 'OK',
          handler: (blah) => {
            this.market.open('com.onetalents.mobile');
            navigator['app'].exitApp();
            // this.openAppMarket();
          },
        },
      ],
    });
    await alert.present();
  }

  // openAppMarket(){
  //   this.market.open('com.onetalents.mobile');
  //   navigator['app'].exitApp();
  // }
  
  oneSignalInit(){
    this.platform.ready().then(()=>{
      //onesignal
      this.oneSignal.startInit('6250835e-0ed8-4f39-9752-63f99e397840', '469469282429');
      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
      this.oneSignal.handleNotificationReceived().subscribe(() => {
        // do something when notification is received
        this.onPushReceived();
      });
  
      this.oneSignal.handleNotificationOpened().subscribe(() => {
      // do something when a notification is opened
        this.onPushOpened();
      });
  
      this.oneSignal.endInit();
       //onesignal

       this.oneSignal.getIds().then(identity => {
        //alert(identity.pushToken + " It's Push Token");
        //alert(identity.userId + " It's Devices ID");
        // Post device_id ke API
        let postdata = {device_id:identity.userId};
        //console.log(postdata);
        this.homeService.postDeviceID(postdata)
        .pipe().subscribe(() => {
        }, (err) => {
          let message = '';
          if (err.error.message === undefined) {
            message = 'Network Problem, Please Try Again.';
          } else {
            message = err.error.message;
          }
          this.presentToast(message);
        });
      });
    });
  }

  onPushReceived(){
      //console.log('received');
  }
  onPushOpened(){
      //console.log('opened');
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
