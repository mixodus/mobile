import { Component, OnInit, ViewChild } from '@angular/core';
import { ChallengesModel } from './challenges.model';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../services/global.service';
import { NavController, IonRefresher } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { ChallengesService } from './challenges.service';
import { Observable } from 'rxjs';
import { DataStore } from '../shell/data-store';
import { Location } from '@angular/common';
import { AuthenticationService } from '../services/auth/authentication.service';

@Component({
  selector: 'app-challenges',
  templateUrl: './challenges.page.html',
  styleUrls: ['./challenges.page.scss'],
})
export class ChallengesPage implements OnInit {

  listing: ChallengesModel;
  medalImg: string = '../../../assets/images/certificate-medal.png';
  connectSubscription;

  @ViewChild(IonRefresher, { static: false })
  refresher: IonRefresher;

  ionViewDidEnter() {
    if (this.auth.token) {
      this.refresher.disabled = false;
    }
  }

  ionViewWillLeave() {
    if (this.auth.token) {
      this.refresher.disabled = true;
    }
  }

  constructor(
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private navCtrl: NavController,
    private network: Network,
    private challengesService: ChallengesService,
    private location: Location,
    private auth: AuthenticationService
  ) {
  }

  ngOnInit() {
    this.route.data.subscribe((resolvedRouteData) => {
        const listingDataStore = resolvedRouteData['data'];

        listingDataStore.state.subscribe(
          (state) => {
            this.listing = state;
            console.log('state: ', state);
            // for (let index = 0; index < this.listing.data.length; index++) {
            //   this.listing.data[index].challenge_photo = "./assets/sample-icons/travel/star.svg";
            // }
          },
          (error) => {
          }
        );
      },
      (error) => {
      });
  }

  goToDetail(id: string) {
    this.globalService.refreshFlag.challenge_detail = true;
    this.navCtrl.navigateForward('/app/events/challenges/challenge-detail/' + id);
  }

  doRefresh(ev) {
    this.connectSubscription = this.network.onConnect().subscribe(() => {
      this.doRefresh(event);
    });
    const dataSource: Observable<ChallengesModel> = this.challengesService.getChallengesDataSource();
    const profileDataStore: DataStore<ChallengesModel> = this.challengesService.getChallengesStore(dataSource, true);
    profileDataStore.state.subscribe(
      (state) => {
        this.listing = state;
      },
      (error) => {
      }
    );
    ev.target.complete();
  }

  goBack() {
    if (this.globalService.previousPage === 'challenge-detail') {
      this.navCtrl.navigateForward(['app/events']);
    } else {
      this.location.back();
    }
    this.globalService.setPreviousPage('');
    // console.log('previousPage: ', this.globalService.previousPage);
  }
}
