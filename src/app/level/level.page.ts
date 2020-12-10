import { Component, OnInit, ViewChild } from '@angular/core';
import { LevelModel } from './level.model';
import { ActivatedRoute } from '@angular/router';
import { Network } from '@ionic-native/network/ngx';
import { Observable } from 'rxjs';
import { LevelService } from './level.service';
import { DataStore } from '../shell/data-store';
import { IonRefresher, NavController } from '@ionic/angular';
import { Location } from '@angular/common';

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

  ionViewWillLeave() {
    this.refresher.disabled = true;
  }

  constructor(
    private route: ActivatedRoute,
    private network: Network,
    private levelService: LevelService,
    private navCtrl: NavController,
    private location: Location
  ) {
  }

  ngOnInit() {
    this.route.data.subscribe((resolvedRouteData) => {
        const levelDataStore = resolvedRouteData['data'];

        levelDataStore.state.subscribe(
          (state) => {
            this.levels = state;
            this.currentProgress = parseInt(this.levels.user.points) / parseInt(this.levels.current_level.level_max_point) * 100;
            this.toNextLevel = parseInt(this.levels.current_level.level_max_point) - parseInt(this.levels.user.points);
          },
          (error) => {
          }
        );
      },
      (error) => {
      });
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
        this.currentProgress = parseInt(this.levels.user.points) / parseInt(this.levels.current_level.level_max_point);
        this.toNextLevel = parseInt(this.levels.current_level.level_max_point) + 1 - (this.currentProgress * 1000);
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
