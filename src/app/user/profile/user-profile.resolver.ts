import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { UserService } from '../user.service';
import { Observable } from 'rxjs';
import { DataStore } from '../../shell/data-store';
import { UserProfileModel } from './user-profile.model';
import { GlobalService } from '../../services/global.service';
import { Storage } from '@ionic/storage';
@Injectable()
export class UserProfileResolver implements Resolve<any> {
  token : String;
  constructor(private userService: UserService, private globalService : GlobalService, private storage : Storage) {


  }

  resolve() {

    const dataSource: Observable<UserProfileModel> = this.userService.getProfileDataSource();
    const dataStore: DataStore<UserProfileModel> = this.userService.getProfileStore(dataSource);
    return dataStore;
  }
}
