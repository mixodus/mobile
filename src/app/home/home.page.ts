import { Component, HostBinding, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeModel } from './home.model';
import { AlertController, ModalController, NavController, Platform, ToastController, } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../services/auth/authentication.service';
import { ThemeableBrowser, } from '@ionic-native/themeable-browser/ngx';
import { DataService } from '../services/data/data.service';
import { Observable } from 'rxjs';
import { HomeService } from './home.service';
import { DataStore } from '../shell/data-store';
import { GlobalService } from '../services/global.service';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Network } from '@ionic-native/network/ngx';
import { AuthGuardService } from '../services/auth/auth-guard.service';
import * as moment from 'moment';
import { InAppBrowserService } from '../core/services/in-app-browser/in-app-browser.service';
import { AppComponent } from '../app.component';
@Component({
  selector: 'app-user-profile',
  templateUrl: './home.page.html',
  styleUrls: [
    './styles/user-profile.page.scss',
    './styles/user-profile.shell.scss',
    './styles/user-profile.ios.scss',
    './styles/user-profile.md.scss',
    './styles/home-banner.scss',
    './home.page.scss'
  ],
})
export class HomePage implements OnInit {
  profile: HomeModel;
  ev: any;
  var: string;
  profileImg = './assets/sample-images/user/default-profile.svg';
  connectSubscription: any;
  refresh = false;
  subscribe: any;

  isInitialBanner = true;

  @HostBinding('class.is-shell') get isShell() {
    return this.profile && this.profile.isShell ? true : false;
  }

  constructor(
    private route: ActivatedRoute,
    public translate: TranslateService,
    private auth: AuthenticationService,
    private authGuard: AuthGuardService,
    private router: Router,
    private dataService: DataService,
    private themeableBrowser: ThemeableBrowser,
    private homeService: HomeService,
    public navCtrl: NavController,
    private globalService: GlobalService,
    public modalController: ModalController,
    private alertCtrl: AlertController,
    private storage: Storage,
    private http: HttpClient,
    private toastCtrl: ToastController,
    private platform: Platform,
    private network: Network,
    private ngZone: NgZone, // private db: DatabaseService,
    private _inAppBrowser: InAppBrowserService,
    private appComponent: AppComponent,
  ) {
  }

  mainBannerOpts = {
    initialSlide: 0,
    speed: 500,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    slidesPerView: '1.25',
    loop: true,
    centeredSlides: true,
    spaceBetween: 10
  };

  arr: any;
  data: any;

  checkSession() {
    // console.log('masuk check session home');
    const headers = new HttpHeaders({
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': String(this.auth.token)
    });

    const options = { headers: headers };

    const checkSessionEndpoint =
      this.globalService.apiUrl +
      'api/home/check_session';

    this.http.get(checkSessionEndpoint, options).subscribe(
      (response) => {
        // process the json data
        // console.log(response);
      },
      (error) => {
        // console.log('error di check session');
      }
    );
  }

  ngOnInit(): void {
    this.presentPopupBanner();
    if (this.auth.token) {
      this.checkSession();
    }
    this.getProfileDetail();
  }

  async presentPopupBanner() {
    const alert = await this.alertCtrl.create({
      message: `<div class="home-message-body">
                    <img src="https://api.oneindonesia.id/uploads/event/hackathon/general/flyer_hackathon.png" alt="">
                </div>`,
      cssClass: 'home-alert',
      buttons: [
        {
          cssClass: 'alert-button-outline',
          text: 'Tutup',
        },
        {
          cssClass: 'alert-button-fill',
          text: 'Lihat',
          handler: () => {
            this.navCtrl.navigateForward(['/app/hackathon']);
          },
        },
      ],
    });

    await alert.present();
  }

  ionViewWillEnter() {
    if (this.auth.token) {
      this.auth.checkExpiredToken();

      if (!this.globalService.isInitialLoadDone.profile) {
        this.getProfileDetail();
        this.globalService.setProfileLoadStatus(true);
      }
      if (!this.globalService.isInitialLoadDone.level) {
        this.getProfileDetail();
        this.globalService.setLevelLoadStatus(true);
      }
      this.appComponent.oneSignalInit();
    }
    if (this.auth.isInitialLogin) {
      this.presentPopupBanner().then(() => {
        this.auth.changeIsInitialLogin(false);
      });
    }
  }


  getProfileDetail() {
    this.homeService.getProfileDataSource().pipe().subscribe((data: any) => {
      this.profile = data;
      if (data.data.flyer_banner.is_active && this.isInitialBanner) {
        // this.presentPopupBanner();
        this.isInitialBanner = false;
      }
    });
  }

  doRefresh(ev) {
    this.profile = null;
    const dataSource: Observable<HomeModel> = this.homeService.getProfileDataSource();
    const profileDataStore: DataStore<HomeModel> = this.homeService.getProfileStore(
      dataSource,
      true
    );
    profileDataStore.state.subscribe(
      (state) => {
        this.profile = state;
      },
      (error) => {
      }
    );
    ev.target.complete();
  }

  getDate(dateString: string) {
    if (dateString) {
      const date = dateString.split(' ')[0];
      const dateObject = moment(date).toDate();

      return dateObject;
    }

    return new Date();
  }

  goToBannerDetail(bannerType: 'event' | 'challenge' | 'news', bannerTypeId: string) {
    if (bannerType == 'event') {
      this.gotoDetailEvent(bannerTypeId);
    }
    if (bannerType == 'news') {
      this.gotoDetailNews(bannerTypeId);
    }
    if (bannerType == 'challenge') {
      this.gotoDetailChallenge(bannerTypeId);
    }
    // this.navCtrl.navigateForward(['/app/news/detail/123']);
  }

  gotoDetailNews(id) {
    this.navCtrl.navigateForward(['/app/news/news-detail', id]);
  }

  gotoDetailEvent(id) {
    this.router.navigate(['/app/events', id]);
  }

  gotoDetailChallenge(id) {
    this.router.navigate(['/app/events/challenges/challenge-detail/', id]);
  }
}
