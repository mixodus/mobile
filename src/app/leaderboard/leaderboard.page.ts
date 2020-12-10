import { Component, OnInit, ViewChild } from '@angular/core';
import { LeaderboardModel } from './leaderboard.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Network } from '@ionic-native/network/ngx';
import { LeaderboardService } from './leaderboard.service';
import { DataStore } from '../shell/data-store';
import { Observable } from 'rxjs';
import { IonRefresher } from '@ionic/angular';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.page.html',
  styleUrls: ['./leaderboard.page.scss'],
})
export class LeaderboardPage implements OnInit {
  userName: string = "Username"
  rankings: LeaderboardModel;
  defaultImg: string = "./assets/sample-images/user/default-profile.svg";
  connectSubscription;

  @ViewChild(IonRefresher, { static: false})
  refresher: IonRefresher;

  ionViewDidEnter() {
     this.refresher.disabled = false;
  }

  ionViewWillLeave() {
     this.refresher.disabled = true;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private network: Network,
    private leaderboardService: LeaderboardService,
  ) { }

  ngOnInit() {
    this.route.data.subscribe((resolvedRouteData) => {
      const projectDataStore = resolvedRouteData['data'];

      projectDataStore.state.subscribe(
        (state) => {
          this.rankings = state;
        },
        (error) => {}
      );
    },
    (error) => {});
  }

  doRefresh(ev) {
    this.connectSubscription = this.network.onConnect().subscribe(() => {
      this.doRefresh(event)
    })
    const dataSource: Observable<LeaderboardModel> = this.leaderboardService.getLeaderboardDataSource();
    const profileDataStore: DataStore<LeaderboardModel> = this.leaderboardService.getLeaderboardStore(dataSource, true)
    profileDataStore.state.subscribe(
      (state) => {
        this.rankings = state
      },
      (error) => { }
    );
    ev.target.complete();
  }

  gotoProfile(userId){
    this.router.navigateByUrl('/profile/'+userId);
  }

}
