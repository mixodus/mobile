import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { FriendProfileService } from './profile.service';
import { GlobalService } from '../../services/global.service';
import { Observable } from 'rxjs';
import { FriendProfileModel } from './profile.model';
import { DataStore } from '../../shell/data-store';
import { Storage } from '@ionic/storage';

@Injectable()
export class FriendProfileResolver implements Resolve<any> {
  token : String;
  constructor(private friendProfileService: FriendProfileService, private globalService : GlobalService, private storage : Storage) { 

    
  }

  resolve(route: ActivatedRouteSnapshot) {
    const dataSource: Observable<FriendProfileModel> = this.friendProfileService.getFriendProfileDataSource(route.params.userId);
    const dataStore: DataStore<FriendProfileModel> = this.friendProfileService.getFriendProfileStore(dataSource);
    return dataStore;
  }
}