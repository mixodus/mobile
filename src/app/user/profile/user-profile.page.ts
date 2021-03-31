import { Component, HostBinding, OnInit, } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { UserProfileModel } from '../profile/user-profile.model';
import {
  AlertController,
  LoadingController,
  NavController,
  PickerController,
  Platform,
  PopoverController,
  ToastController,
} from '@ionic/angular';
import { LanguageService } from '../../language/language.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { GlobalService } from '../../services/global.service';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { DataStore } from '../../../app/shell/data-store';
import { UserService } from '../user.service';
import { Network } from '@ionic-native/network/ngx';
import { LevelModel } from '../../level/level.model';
import { LevelService } from '../../level/level.service';

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
    private navCtrl: NavController,
    public translate: TranslateService,
    public languageService: LanguageService,
    public alertController: AlertController,
    private auth: AuthenticationService,
    private globalService: GlobalService,
    private storage: Storage,
    private router: Router,
    private userService: UserService,
    private levelService: LevelService,
    private toast: ToastController,
    private platform: Platform,
    private network: Network,
  ) {
  }

  initLoad() {
    this.route.data.subscribe(
      (resolvedRouteData) => {
        const profileDataStore = resolvedRouteData['dataUser'];

        profileDataStore.state.subscribe(
          (state) => {
            this.profile = state;
            if (this.profile.profile_picture === undefined) {
              this.profile.profile_picture = 'assets/sample-images/user/default-profile.svg';
            }
            if (this.profile.skill_text !== '') {
              this.skills = this.profile.skill_text.split(',');
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
    if (this.auth.token) {
      this.auth.checkExpiredToken();
      this.subscribe = this.platform.backButton.subscribe(() => {
        this.router.navigateByUrl('app/home');
      });
      this.connectSubscription = this.network.onConnect().subscribe(() => {
      });
      this.auth.checkExpiredToken();

      if (!this.globalService.isInitialLoadDone.profile) {
        this.initLoadProfile();
        this.globalService.setProfileLoadStatus(true);
      }
      if (!this.globalService.isInitialLoadDone.level) {
        this.initLoadLevel();
        this.globalService.setLevelLoadStatus(true);
      }
    }
  }

  initLoadProfile() {
    const dataSource: Observable<UserProfileModel> = this.userService.getProfileDataSource();
    const profileDataStore: DataStore<UserProfileModel> = this.userService.getProfileStore(
      dataSource,
      true
    );
    profileDataStore.state.subscribe(
      (state) => {
        //console.log('state: ', state);
        this.profile = state;
        // console.log(this.profile.profile_picture);
        if (this.profile.profile_picture === undefined) {
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
  }

  initLoadLevel() {
    const dataSource = this.levelService.getLevelDataSource();
    const dataStore = this.levelService.getLevelStore(dataSource, true);

    dataStore.state.subscribe(
      (state) => {
        this.levels = state;
        this.currentProgress = Number(this.levels.user.points) / Number(this.levels.current_level.level_max_point) * 100;
        this.toNextLevel = Number(this.levels.current_level.level_max_point) - Number(this.levels.user.points);
      },
      (error) => {
      }
    );
  }

  ionViewDidLeave() {
    if (this.auth.token) {
      this.subscribe.unsubscribe();
      this.connectSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.initLoad();
  }

  editProfile() {
    const navigationExtras: NavigationExtras = {
      state: {
        data: this.profile,
      },
    };
    this.navCtrl.navigateForward(['/app/user/edit'], navigationExtras);
  }

  getTranslations() {
    // get translations for this page to use in the Language Chooser Alert
    this.translate.getTranslation(this.translate.currentLang).subscribe((translations) => {
      this.translations = translations;
    });
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
        //console.log('state: ', state);
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

    this.initLoadLevel();

    ev.target.complete();
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
