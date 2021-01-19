import { Component, HostBinding, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { HomeModel } from './home.model';
import { AlertController, ModalController, NavController, Platform, ToastController, } from '@ionic/angular';
import { LanguageService } from '../language/language.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../services/auth/authentication.service';
import { ThemeableBrowser, ThemeableBrowserObject, ThemeableBrowserOptions, } from '@ionic-native/themeable-browser/ngx';
import { DataService } from '../services/data/data.service';
import { Observable } from 'rxjs';
import { HomeService } from './home.service';
import { DataStore } from '../shell/data-store';
import { GlobalService } from '../services/global.service';
import { HomeModalPage } from '../modal/update-modal/home-modal.page';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ZoomImageModalComponent } from '../modal/zoom-image-modal/zoom-image-modal.component';
import { Network } from '@ionic-native/network/ngx';
import { AuthGuardService } from '../services/auth/auth-guard.service';
import { SearchPeopleModel } from '../user/search.model';
import * as moment from 'moment';
import { InAppBrowserService } from '../core/services/in-app-browser/in-app-browser.service';
import { NewsResponse } from '../core/models/news/NewsResponse';

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
  numberOfNotification: number;
  profile: HomeModel;
  available_languages = [];
  translations;
  ev: any;
  var: string;
  var2: string;
  var3: string;
  isset: boolean;
  profileImg: string = './assets/sample-images/user/default-profile.svg';
  companyImg: string = './assets/images/company.svg';
  printName: string = '';
  urlDownload: string;
  connectSubscription: any;
  refresh: boolean = false;
  searchedPeople: SearchPeopleModel;
  searchResult = Array<object>({ user_id: String, name: String });
  selectedPeople: string;
  hideSuggestion: boolean = true;
  subscribe: any;
  noSearch: boolean = true;
  peopleDataStore: DataStore<SearchPeopleModel>;
  searchValue: string;

  newsList: NewsResponse;
  jobsPreviewHome;

  @HostBinding('class.is-shell') get isShell() {
    return this.profile && this.profile.isShell ? true : false;
  }

  constructor(
    private route: ActivatedRoute,
    public translate: TranslateService,
    public languageService: LanguageService,
    public alertController: AlertController,
    private auth: AuthenticationService,
    private authGuard: AuthGuardService,
    private router: Router,
    private dataService: DataService,
    private themeableBrowser: ThemeableBrowser,
    private homeService: HomeService,
    public navCtrl: NavController,
    private globalService: GlobalService,
    public modalController: ModalController,
    private storage: Storage,
    private http: HttpClient,
    // private netService: NetworkServiceProviderService,
    private toastCtrl: ToastController,
    private platform: Platform,
    private network: Network,
    private ngZone: NgZone, // private db: DatabaseService,
    private _inAppBrowser: InAppBrowserService
  ) {
  }

  sliderConfig = {
    spaceBetween: 1,
    initialSlide: 0,
    slidesPerView: 2,
  };

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
    console.log('masuk check session home');
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
        console.log(response);
      },
      (error) => {
        console.log('error di check session');
      }
    );
  }

  ngOnInit(): void {
    this.numberOfNotification = 5;
    this.isset = false;
    if (this.auth.token) {
      this.checkSession();
    }

    this.fetchData();
    this.fetchProfile();
    this.setUnreadNotification();
  }

  ionViewDidEnter(): void {
    if (this.auth.token) {
      this.auth.checkExpiredToken();
      this.auth.checkCompleteProfile();
    }

    this.subscribe = this.platform.backButton.subscribe(() => {
      this.presentAlertConfirm();
    });
    this.connectSubscription = this.network.onConnect().subscribe(() => {
      this.doRefresh(event);
    });
    this.ngZone.run(() => this.ngOnInit());
    this.refreshAuto();
    this.fetchData();

  }

  fetchData() {
    this.route.data.subscribe((resolvedState) => {
      resolvedState.news.state.subscribe(
        (data) => {
          this.newsList = data;
          this.filterData();
        },
        (err) => {
          console.log(err);
        }
      );
    });

    this.route.data.subscribe((resolvedState) => {
      resolvedState.jobs.state.subscribe(
        (data) => {
          this.jobsPreviewHome = data.data[0];
          this.filterData();
        },
        (err) => {
          console.log(err);
        }
      );
    });
  }

  fetchProfile() {

  }

  setUnreadNotification() {
    this.route.data.subscribe((resolvedState) => {
      resolvedState.jobs.state.subscribe(
        (data) => {
          this.jobsPreviewHome = data.data[0];
          this.filterData();
        },
        (err) => {
          console.log(err);
        }
      );
    });
  }

  filterData() {
    this.data = this.newsList.data.filter((data) => {
      return data;
    });
  }

  ionViewDidLeave() {
    this.subscribe.unsubscribe();
    this.connectSubscription.unsubscribe();
  }

  getDate(dateString: string) {
    if (dateString) {
      const date = dateString.split(' ')[0];
      const dateObject = moment(date).toDate();

      return dateObject;
    }

    return new Date();
  }

  countLength(data: String) {
    var length = 0;
    while (data[length] !== undefined) {
      length++;
    }
    if (length < 70) {
      return true;
    } else {
      return false;
    }
  }

  openUrl(url) {
    const options: ThemeableBrowserOptions = {
      statusbar: {
        color: '#ffffffff',
      },
      toolbar: {
        height: 44,
        color: '#f0f0f0ff',
      },
      title: {
        color: '#003264ff',
        showPageTitle: true,
      },
      backButton: {
        wwwImage: 'assets/img/back.png',
        imagePressed: 'back_pressed',
        wwwImageDensity: 2,
        align: 'right',
        event: 'backPressed',
      },
      forwardButton: {
        wwwImage: 'assets/img/forward.png',
        imagePressed: 'forward_pressed',
        wwwImageDensity: 2,
        align: 'right',
        event: 'forwardPressed',
      },
      closeButton: {
        wwwImage: 'assets/img/close.png',
        imagePressed: 'close_pressed',
        wwwImageDensity: 2,
        align: 'left',
        event: 'closePressed',
      },
      // customButtons: [
      //   {
      //     image: 'share',
      //     imagePressed: 'share_pressed',
      //     align: 'right',
      //     event: 'sharePressed'
      //   }
      // ],
      // menu: {
      //   image: 'menu',
      //   imagePressed: 'menu_pressed',
      //   title: 'Test',
      //   cancel: 'Cancel',
      //   align: 'right',
      //   items: [
      //     {
      //       event: 'helloPressed',
      //       label: 'Hello World!'
      //     },
      //     {
      //       event: 'testPressed',
      //       label: 'Test!'
      //     }
      //   ]
      // },
      backButtonCanClose: true,
    };
    const browser: ThemeableBrowserObject = this.themeableBrowser.create(url, '_blank', options);
  }

  getTranslations() {
    // get translations for this page to use in the Language Chooser Alert
    this.translate.getTranslation(this.translate.currentLang).subscribe((translations) => {
      this.translations = translations;
    });
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

  goToNewsDetail(url: string) {
    this._inAppBrowser.openBrowser(url);
    // this.navCtrl.navigateForward(['/app/news/detail', id]);
    // this.navCtrl.navigateForward(['/app/events']);
  }

  gotoDetailJob(jobId) {
    this.ionViewDidLeave();
    this.globalService.refreshFlag.job_detail = true;
    this.navCtrl.navigateRoot(['/app/jobs/job-detail', jobId]);
  }

  gotoDetailEvent(id) {
    this.router.navigate(['/app/events', id]);
  }

  gotoDetailChallenge(id) {
    this.router.navigate(['/app/events/challenges/challenge-detail/', id]);
  }

  gotoLevel() {
    this.router.navigateByUrl('app/user/level');
  }

  gotoProfile1(profileData) {
    let navigationExtras: NavigationExtras = {
      state: {
        data: profileData,
      },
    };

    this.navCtrl.navigateForward(['/app/home/profile', navigationExtras]);
  }

  gotoProfile(data) {
    this.ionViewDidLeave();
    this.navCtrl.navigateRoot('/profile/' + data.user_id);
  }

  gotoSearched(id) {
    this.ionViewDidLeave();
    this.navCtrl.navigateRoot('/profile/' + id);
  }

  gotoMyProfile() {
    this.router.navigateByUrl('app/user');
  }

  goToJobStatus() {
    this.router.navigateByUrl('app/jobs');
    this.globalService.jobSegmentValue = 'status';
  }

  addTimeout(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  doRefresh(ev) {
    this.profile = null;

    // this.connectSubscription = this.network.onConnect().subscribe(() => {
    //   this.doRefresh(ev);
    // });

    const dataSource: Observable<HomeModel> = this.homeService.getProfileDataSource();
    const profileDataStore: DataStore<HomeModel> = this.homeService.getProfileStore(
      dataSource,
      true
    );
    profileDataStore.state.subscribe(
      (state) => {
        this.profile = state;
        // get translations for this page to use in the Language Chooser Alert
        this.getTranslations();

        this.translate.onLangChange.subscribe(() => {
          this.getTranslations();
        });
      },
      (error) => {
      }
    );

    ev.target.complete();
  }

  refreshAuto() {
    console.log('masuk refreshAuto');
    this.profile = null;

    this.route.data.subscribe(
      (resolvedRouteData) => {
        resolvedRouteData.data.state.subscribe(
          (state) => {
            this.profile = state;
            console.log('this.profile banner: ', this.profile.data.banner);
            let apiVersion = this.profile.data.info.api_version;
            this.globalService.maxFeeReferal = this.profile.data.info.max_fee_referral;

            this.setUserId();
            // get translations for this page to use in the Language Chooser Alert
            // this.getTranslations();

            // this.translate.onLangChange.subscribe(() => {
            //   this.getTranslations();
            // });
          },
          (error) => {
          }
        );
      },
      (error) => {
      }
    );
  }

  setUserId() {
    this.storage.set(this.profile.data.user.user_id, 'userId');
    this.storage.get('userId').then((user_id) => {
      console.log('userId ' + user_id);
    });
  }

  searchList(ev: any): void {
    if (this.searchValue != undefined && this.searchValue != '') {
      //search
      this.hideSuggestion = false;
      this.filterSearch(this.searchValue);
    } else {
      this.hideSuggestion = true;
    }
  }

  filterSearch(filter: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': `${this.auth.token}`
    });
    const options = { headers: headers };

    const generalSearchEndpoint =
      this.globalService.apiUrl +
      'search/generalsearch?q=' + filter;

    const peopleDataSource: Observable<SearchPeopleModel> = this.http.get<SearchPeopleModel>(generalSearchEndpoint, options);
    const shellModel: SearchPeopleModel = new SearchPeopleModel();
    this.peopleDataStore = new DataStore(shellModel);
    // Trigger the loading mechanism (with shell) in the dataStore
    this.peopleDataStore.load(peopleDataSource);
    this.peopleDataStore.state.subscribe((state) => {
      // let result = Array<object>({id:String, name:String});
      this.searchResult = [];
      let result = [];
      let idResult = [];
      let flag = false;
      state.data.data.forEach((element) => {
        // let name = element.fullname;
        // name.id = element.user_id;
        // result.push({id:element.user_id, name:element.fullname});
        idResult.push(element.user_id);
        result.push(element.fullname);
      });
      // result.push(state.data.data.map(x => x.fullname))
      console.log(result);
      for (let i = 0; i < state.data.data.length; i++) {
        flag = false;
        for (let j = 0; j < result.length; j++) {
          if (state.data.data[i].fullname.toLowerCase() === result[j].toLowerCase()) {
            flag = true;
          }
        }
        if (flag === false) {
          idResult.push(state.data.data[i].user_id);
          result.push(state.data.data[i].fullname);
        }
      }
      // console.log(result)
      // console.log(idResult)
      for (let i = 0; i < result.length; i++) {
        this.searchResult.push({ user_id: idResult[i], name: result[i] });
      }
      // this.searchResult.push({id:idResult,name:result});
      console.log(this.searchResult);
    });
  }

  async openModal(title, message) {
    const modal = await this.modalController.create({
      component: HomeModalPage,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        title: title,
        message: message,
      },
    });

    modal.onDidDismiss().then((dataReturned) => {
      // alert("goto " + this.urlDownload );
      window.open(this.urlDownload, '_self');
    });

    return await modal.present();
  }

  async zoomImage() {
    let image = this.profileImg;
    if (this.profile.data.user.profile_picture_url) {
      image = this.profile.data.user.profile_picture_url;
    }
    const modal = await this.modalController.create({
      component: ZoomImageModalComponent,
      componentProps: {
        imageUrl: image,
      },
      cssClass: 'zoom-image-modal-class',
    });
    await modal.present();
  }

  async showAlert(message) {
    let toast = await this.toastCtrl.create({
      cssClass: 'error',
      message: message,
      position: 'bottom',
      duration: 2000,
    });
    toast.present();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      message: 'Are you sure you want to exit?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Yes',
          handler: () => {
            navigator['app'].exitApp();
          },
        },
      ],
    });

    await alert.present();
  }
}
