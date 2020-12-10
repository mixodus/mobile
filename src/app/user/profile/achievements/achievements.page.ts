import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AchievementsModel } from './achievements.model';
import { UserProfileModel } from '../user-profile.model';
import { ShellModel } from '../../../shell/data-store';
import { AchievementsService } from './achievements.service';
import * as moment from 'moment';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.page.html',
  styleUrls: ['./styles/achievements.page.scss', './styles/achievements.shell.scss'],
})
export class AchievementsPage implements OnInit {
  achievements: AchievementsModel & ShellModel;
  currentUser: any;
  data: any;

  constructor(private route: ActivatedRoute, private achievementsService: AchievementsService) { }

  ngOnInit() {
    this.route.data.subscribe((resolvedData) => {
      resolvedData.profile.state.subscribe(
        (profile: UserProfileModel & ShellModel) => {
          this.currentUser = profile;

          if (this.currentUser) {
            console.log(this.currentUser);
          }
        },
        (err) => {
          console.error(err);
        }
      );
    });
    this.route.data.subscribe(
      (resolvedRouteData) => {
        const achievementDataStore = resolvedRouteData['data'];

        achievementDataStore.state.subscribe((state) => {
          this.achievements = state;
          console.log(this.achievements);
          this.filterData();
          console.log(this.data);
        }),
          (error) => { };
      },
      (error) => { }
    );
  }

  filterData() {
    this.data = this.achievements.data.filter((e) => {
      return e;
    })
  }

  getImage(filename: string) {
    return this.achievementsService.getImage(filename);
  }

  getDate(stringData: string){
    const date = moment(stringData);
    return date.format('YYYY');
  }
  doRefresh(event: any) { }
}
