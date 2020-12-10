import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { JobDetailsModel } from './job-details.model';
import { GlobalService } from '../../services/global.service';
import {
  LoadingController,
  NavController,
  ToastController,
  AlertController,
  Platform,
} from '@ionic/angular';
import { AuthenticationService } from '../../../app/services/auth/authentication.service';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { UserProfileModel } from '../../user/profile/user-profile.model';

@Component({
  selector: 'app-event-details',
  templateUrl: './job-details.page.html',
  styleUrls: ['./styles/job-details.page.scss', './styles/job-details.shell.scss'],
})
export class JobDetailsPage implements OnInit {
  jobsDetail: JobDetailsModel;
  profile: UserProfileModel;
  status: boolean = false;

  appliedJobData: {};
  public index: number;
  jobList = Array();
  message: string;
  segmentValue = 'job';
  details: any;
  companyImg: string = 'assets/images/company.svg';
  subscribe: any;
  toggleState = 0;

  testData = '<p>Test</p>';

  @ViewChild('htmlDiv', { static: true }) simple;

  @HostBinding('class.is-shell') get isShell() {
    return false;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private auth: AuthenticationService,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private toast: ToastController,
    private alertCtrl: AlertController,
    private platform: Platform
  ) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(
      (resolvedRouteData) => {
        const detailsDataStore = resolvedRouteData['data'];

        detailsDataStore.state.subscribe(
          (state) => {
            console.log(state);
            this.jobsDetail = state;
          },
          (error) => {
          }
        );
      },
      (error) => {
      }
    );

    this.route.data.subscribe((resolvedRouteData) => {
      const profileDataStore = resolvedRouteData['special'];
      profileDataStore.state.subscribe((state) => {
        this.profile = state;
      });
    });
  }

  ionViewWillEnter() {
    this.auth.checkExpiredToken();
    this.subscribe = this.platform.backButton.subscribe(() => {
      this.navCtrl.back();
    });
  }

  ionViewWillLeave() {
    this.subscribe.unsubscribe();
  }

  handleToggleContent(index: number) {
    this.toggleState = index;
  }

  easyApply() {
    //check profile completion before going to easy apply page
    if (
      !this.profile.email ||
      this.profile.email === '' ||
      !this.profile.contact_no ||
      this.profile.contact_no === ''
    ) {
      this.presentToast('Please complete your profile!');
      this.navCtrl.navigateForward(['app/user']);
      return;
    }
    let navigationExtras: NavigationExtras = {
      state: {
        data: this.jobsDetail.data,
        profile: this.profile,
      },
    };
    this.navCtrl.navigateForward('/app/jobs/easy-apply', navigationExtras);
  }

  // async withdrawConfirm() {
  //   const alert = await this.alertCtrl.create({
  //     header: 'Confirm',
  //     message: 'Are you sure you want to withdraw?',
  //     buttons: [
  //       {
  //         text: 'No',
  //         role: 'cancel',
  //       },
  //       {
  //         text: 'Yes',
  //         handler: (blah) => {
  //           this.withdraw();
  //         },
  //       },
  //     ],
  //   });
  //   await alert.present();
  // }

  withdraw() {
  }

  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }

  goBack() {
    this.navCtrl.back();
  }
}
