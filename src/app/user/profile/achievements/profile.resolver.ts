import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { AchievementsService } from './achievements.service';

@Injectable()
export class ProfileResolver implements Resolve<any> {
  constructor(private achievementsService: AchievementsService,) {}

  resolve() {
    return this.achievementsService.getProfileDataStore(true);
  }
}