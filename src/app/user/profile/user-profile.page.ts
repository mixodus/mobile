import {
  Component,
  OnInit,
  HostBinding,
  ViewChild,
  ɵCompiler_compileModuleSync__POST_R3__,
} from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { UserProfileModel } from '../profile/user-profile.model';
import {
  AlertController,
  NavController,
  ToastController,
  Platform,
  PopoverController, LoadingController,
} from '@ionic/angular';
import { LanguageService } from '../../language/language.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { GlobalService } from '../../services/global.service';
import { take, map, finalize } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DataStore } from '../../../app/shell/data-store';
import { UserService } from '../user.service';
import { PickerController } from '@ionic/angular';

// import { NetworkServiceProviderService } from '../../network-service-provider.service';
import { Network } from '@ionic-native/network/ngx';
import { PopoverPage } from '../../popover/popover.page';
import { LevelModel } from '../../level/level.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: [
    './styles/user-profile.page.scss',
    './styles/user-profile.shell.scss',
    './styles/user-profile.ios.scss',
    './styles/user-profile.md.scss',
  ],
})
export class UserProfilePage implements OnInit {
  profile: UserProfileModel;
  setValue: any = 0;
  setText: any = 'Jan';
  month: { text: string; value: number };
  experienceImage = './assets/images/building.png';
  educationImg = './assets/images/graduation-hat.png';
  projectImg = './assets/images/project.png';
  profileImg = './assets/sample-images/user/default-profile.svg';
  skills: Array<string> = [];

  available_languages = [];
  translations;
  subscribe: any;
  connectSubscription: any;

  levels: LevelModel;
  currentProgress = 0;
  toNextLevel = 0;

  @HostBinding('class.is-shell') get isShell() {
    return this.profile && this.profile.isShell;
  }

  constructor(
    private route: ActivatedRoute,
    // private netService : NetworkServiceProviderService,
    private navCtrl: NavController,
    public translate: TranslateService,
    public languageService: LanguageService,
    public alertController: AlertController,
    private auth: AuthenticationService,
    private globalService: GlobalService,
    private storage: Storage,
    private router: Router,
    private userService: UserService,
    private toast: ToastController,
    private platform: Platform,
    private network: Network,
    private pickerController: PickerController,
    private popoverCtrl: PopoverController,
    private loadingCtrl: LoadingController,
    private http: HttpClient,
  ) {
  }

  initLoad() {
    this.route.data.subscribe(
      (resolvedRouteData) => {
        const profileDataStore = resolvedRouteData['dataUser'];

        profileDataStore.state.subscribe(
          (state) => {
            this.profile = state;
            console.log('this.profile: ', this.profile);
            if (this.profile.profile_picture === undefined) {
              this.profile.profile_picture = 'assets/sample-images/user/default-profile.svg';
            }
            if (this.profile.skill_text !== '') {
              console.log('this.profile.skill_text: ', this.profile.skill_text);
              this.skills = this.profile.skill_text.split(',');
              console.log('skills: ', this.skills);
            } else {
              this.skills = [];
            }

            // get translations for this page to use in the Language Chooser Alert
            this.getTranslations();

            this.translate.onLangChange.subscribe(() => {
              this.getTranslations();
            });
          },
          (error) => {
          }
        );

        const levelDataStore = resolvedRouteData['dataLevel'];

        levelDataStore.state.subscribe(
          (state) => {
            this.levels = state;
            this.currentProgress = Number(this.levels.user.points) / Number(this.levels.current_level.level_max_point) * 100;
            this.toNextLevel = Number(this.levels.current_level.level_max_point) - Number(this.levels.user.points);
          },
          (error) => {
          }
        );

      },
      (error) => {
      }
    );
  }

  ionViewWillEnter(): void {
    this.auth.checkExpiredToken();
    this.subscribe = this.platform.backButton.subscribe(() => {
      this.router.navigateByUrl('app/home');
    });
    this.connectSubscription = this.network.onConnect().subscribe(() => {
    });
    this.auth.checkExpiredToken();
  }

  ionViewDidLeave() {
    this.subscribe.unsubscribe();
    this.connectSubscription.unsubscribe();
  }

  gotoReferralPage() {
    this.router.navigate(['referral']);
  }

  ngOnInit(): void {
    console.log('init loaded');
    this.initLoad();
  }

  convertDate(date: string): string {
    if (date === '') {
      return 'No date';
    } else {
      const date_format = new Date(date);
      return date_format.toLocaleString('default', { month: 'short', year: 'numeric' });
    }
  }

  async openPopover(ev: Event) {
    const popover = await this.popoverCtrl.create({
      component: PopoverPage,
      componentProps: { homeRef: this },
      event: ev,
    });
    popover.present();
  }

  async verifyEmail() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': `${this.auth.token}`
    });
    const options = { headers: headers };

    const body = {};

    const verifyEmailEndpoint =
      this.globalService.apiUrl +
      'api/user/verify-email';

    this.http.get(verifyEmailEndpoint, options).pipe(
      finalize(() => this.loadingCtrl.dismiss())
    ).subscribe((data: any) => {
        this.presenAlertVerifyEmail(data.message);
        // this.presentToast(data.message);
    }, (err) => {
      this.presenAlertVerifyEmail(err.message);
      // this.presentToast(err.message);
      }
    );
  }

  async presenAlertVerifyEmail(message) {
    const alert = await this.alertController.create({
      message: message,
      buttons: ['Tutup']
    });
    await alert.present();
  }

  editProfile() {
    const navigationExtras: NavigationExtras = {
      state: {
        data: this.profile,
      },
    };
    this.navCtrl.navigateForward(['/app/user/edit'], navigationExtras);
  }

  friendReqList() {
    this.navCtrl.navigateForward('app/user/friend-request');
  }

  friendList() {
    this.navCtrl.navigateForward('app/user/friend-list');
  }

  navigateTo() {
    this.router.navigateByUrl('app/user/accounts');
  }

  getTranslations() {
    // get translations for this page to use in the Language Chooser Alert
    this.translate.getTranslation(this.translate.currentLang).subscribe((translations) => {
      this.translations = translations;
    });
  }

  async openLanguageChooser() {
    this.available_languages = this.languageService.getLanguages().map((item) => ({
      name: item.name,
      type: 'radio',
      label: item.name,
      value: item.code,
      checked: item.code === this.translate.currentLang,
    }));

    const alert = await this.alertController.create({
      header: this.translations.SELECT_LANGUAGE,
      inputs: this.available_languages,
      cssClass: 'language-alert',
      buttons: [
        {
          text: this.translations.CANCEL,
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          },
        },
        {
          text: this.translations.OK,
          handler: (data) => {
            if (data) {
              this.translate.use(data);
            }
          },
        },
      ],
    });
    await alert.present();
  }

  doRefresh(ev) {
    this.connectSubscription = this.network.onConnect().subscribe(() => {
      // this.doRefresh(event);
    });
    const dataSource: Observable<UserProfileModel> = this.userService.getProfileDataSource();
    const profileDataStore: DataStore<UserProfileModel> = this.userService.getProfileStore(
      dataSource,
      true
    );
    profileDataStore.state.subscribe(
      (state) => {
        console.log('state: ', state);
        this.profile = state;
        // console.log(this.profile.profile_picture);
        if (this.profile.profile_picture == undefined) {
          this.profile.profile_picture = 'assets/sample-images/user/default-profile.svg';
        }
        if (this.profile.skill_text !== '') {
          this.skills = this.profile.skill_text.split(',');
        } else {
          this.skills = [];
        }
      },
      (error) => {
      }
    );
    ev.target.complete();
  }

  goToBootcamp() {
    this.router.navigate(['history/bootcamp/2']);
  }

  goToEvent() {
    this.router.navigate(['history/event/1']);
  }

  goToChallenge() {
    this.router.navigate(['history/challenge']);
  }

  goToSkills() {
    let navigationExtras: NavigationExtras;
    navigationExtras = {
      state: {
        data: this.skills,
      },
    };
    this.navCtrl.navigateForward(['/app/user/skills'], navigationExtras);
  }

  gotoCertification() {
    this.router.navigate(['app/user/certification']);
  }

  gotoProject() {
    const navigationExtras: NavigationExtras = {
      state: {
        workId: this.profile.work_experience,
      },
    };
    let message: string;
    if (this.profile.project.length === 0 && this.profile.work_experience.length === 0) {
      message = 'Anda harus menambahkan Pengalaman Kerja terlebih dahulu.';
      this.presentToast(message);
    } else {
      this.navCtrl.navigateForward(['/app/user/projects'], navigationExtras);
    }
  }

  goToLevel() {
    this.router.navigate(['app/user/level']);
  }

  signOut() {
    this.confirm();
  }

  goBack() {
    this.navCtrl.navigateBack(['/app/home']);
  }

  async confirm() {
    const alert = await this.alertController.create({
      header: 'Keluar',
      message: 'Anda yakin ingin keluar ?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
        },
        {
          text: 'Ya',
          handler: (blah) => {
            this.auth.signOut();
          },
        },
      ],
    });

    await alert.present();
  }

  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }
}
