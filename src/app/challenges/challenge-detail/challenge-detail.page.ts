import { Component, OnInit, ViewChild } from '@angular/core';
import { ChallengeDetailModel } from './challenge-detail.model';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from '../../services/global.service';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { ChallengesService } from '../challenges.service';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-challenge-detail',
  templateUrl: './challenge-detail.page.html',
  styleUrls: ['./challenge-detail.page.scss'],
})
export class ChallengeDetailPage implements OnInit {

  details: ChallengeDetailModel;
  defaultImg: string = './assets/sample-images/user/default-profile.svg';
  challengePhoto: string = '../../../assets/images/certificate-medal.png';
  progress: Number;
  // progress: string;

  @ViewChild('htmlDiv', { static: true }) simple;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private globalService: GlobalService,
    private auth: AuthenticationService,
    private loadingCtrl: LoadingController,
    private toast: ToastController,
    private challengesService: ChallengesService,
    private router: Router,
    private navCtrl: NavController,
    private location: Location
  ) {
  }

  ngOnInit() {
    this.route.data.subscribe((resolvedRouteData) => {
        const detailsDataStore = resolvedRouteData['data'];

        detailsDataStore.state.subscribe(
          (state) => {
            this.details = state;
            console.log('state: ', state);
            const description = this.details.data.challenge_long_desciption;
            console.log('description: ', description);
            this.simple.nativeElement.innerHTML = this.globalService.decode(description);
            if (this.details.data.me !== null) {
              // this.progress = (parseInt(this.details.data.me.total_current_task) / parseInt(this.details.data.me.total_task)).toString();
              this.progress = Number(this.details.data.me.total_current_task) / Number(this.details.data.me.total_task) * 100;
              console.log('progress: ', this.progress);
            }
            // this.details.data.challenge_photo = "./assets/sample-icons/travel/star.svg";
          },
          (error) => {
          }
        );
      },
      (error) => {
      });
  }

  async joinChallenge() {
    let loading = await this.loadingCtrl.create();
    await loading.present();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': `${this.auth.token}`
    });

    const body = {'challenge_id': this.details.data.challenge_id};

    const options = { headers: headers};

    const joinChallengeEndpoint =
      this.globalService.apiUrl +
      'api/challenge/join';

    this.http.post(joinChallengeEndpoint, body, options).pipe(
      finalize(() => this.loadingCtrl.dismiss())
    )
      .subscribe(data => {
        this.refresh();
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

  refresh() {
    this.globalService.refreshFlag.challenge_detail = true;
    const dataSource = this.challengesService.getChallengeDetailDataSource(this.details.data.challenge_id);
    const dataStore = this.challengesService.getChallengeDetailStore(dataSource);

    dataStore.state.subscribe(
      (state) => {
        this.details = state;
        if (this.details.data.me !== null) {
          this.progress = Number(this.details.data.me.total_current_task) / Number(this.details.data.me.total_task) * 100;
          // this.progress = (parseInt(this.details.data.me.total_current_task) / parseInt(this.details.data.me.total_task)).toString();
        }
        this.details.data.challenge_photo = './assets/sample-icons/travel/star.svg';
      },
      (error) => {
      }
    );
  }

  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  gotoProfile(userId) {
    this.router.navigateByUrl('/profile/' + userId);
  }

  goBack() {
    console.log('restrictedBackUrl: ', this.globalService.restrictedBackUrl);
    const isRestricted = this.globalService.previousPage === 'quiz';
    isRestricted ? this.navCtrl.navigateBack('app/events/challenges') : this.location.back();
    this.globalService.setBackRestrictedUrl('');
    this.globalService.setPreviousPage('challenge-detail');
    // this.navCtrl.navigateBack('app/events/challenges');
  }
}
