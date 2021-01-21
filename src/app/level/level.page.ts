import { Component, OnInit, ViewChild } from '@angular/core';
import { LevelModel } from './level.model';
import { ActivatedRoute } from '@angular/router';
import { Network } from '@ionic-native/network/ngx';
import { Observable } from 'rxjs';
import { LevelService } from './level.service';
import { DataStore } from '../shell/data-store';
import { IonRefresher, NavController } from '@ionic/angular';
import { Location } from '@angular/common';
import { AuthenticationService } from '../services/auth/authentication.service';

@Component({
  selector: 'app-level',
  templateUrl: './level.page.html',
  styleUrls: ['./level.page.scss'],
})
export class LevelPage implements OnInit {

  levels: LevelModel;
  currentProgress: number = 0;
  toNextLevel: number = 0;
  connectSubscription;

  @ViewChild(IonRefresher, { static: false })
  refresher: IonRefresher;

  ionViewDidEnter() {
    this.refresher.disabled = false;
  }

  ionViewWillEnter(): void {
    this.loadLevelData();
  }

  ionViewWillLeave() {
    this.refresher.disabled = true;
  }

  constructor(
    private route: ActivatedRoute,
    private network: Network,
    private levelService: LevelService,
    private navCtrl: NavController,
    private location: Location,
    private auth: AuthenticationService
  ) {
  }

  ngOnInit() {
    this.route.data.subscribe((resolvedRouteData) => {
        const levelDataStore = resolvedRouteData['data'];

        levelDataStore.state.subscribe(
          (state) => {
            this.levels = state;
            this.currentProgress = this.levels.user.points / this.levels.current_level.level_max_point * 100;
            this.toNextLevel = this.levels.current_level.level_max_point - this.levels.user.points;
          },
          (error) => {
          }
        );
      },
      (error) => {
      });
  }

  loadLevelData() {
    const dataSource: Observable<LevelModel> = this.levelService.getLevelDataSource();
    const profileDataStore: DataStore<LevelModel> = this.levelService.getLevelStore(dataSource, true);
    profileDataStore.state.subscribe(
      (state) => {
        this.levels = state;
        this.currentProgress = this.levels.user.points / this.levels.current_level.level_max_point * 100;
        this.toNextLevel = this.levels.current_level.level_max_point - this.levels.user.points;
      },
      (error) => {
      }
    );
  }

  doRefresh(ev) {
    this.connectSubscription = this.network.onConnect().subscribe(() => {
      this.doRefresh(event);
    });
    const dataSource: Observable<LevelModel> = this.levelService.getLevelDataSource();
    const profileDataStore: DataStore<LevelModel> = this.levelService.getLevelStore(dataSource, true);
    profileDataStore.state.subscribe(
      (state) => {
        this.levels = state;
        this.currentProgress = this.levels.user.points / this.levels.current_level.level_max_point * 100;
        this.toNextLevel = this.levels.current_level.level_max_point - this.levels.user.points;
      },
      (error) => {
      }
    );
    ev.target.complete();
  }

  goBack() {
    this.location.back();
    // this.navCtrl.navigateBack(['/app/user']);
  }
}
