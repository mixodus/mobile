import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { FriendRequestService } from './friend-request.service';
import { Observable } from 'rxjs';
import { DataStore } from '../../shell/data-store';
import { FriendRequestModel } from './friend-request.model';
import { GlobalService } from '../../services/global.service';
import { Storage } from '@ionic/storage';
@Injectable()
export class FriendRequestResolver implements Resolve<any> {
  token : String;
  constructor(private friendRequestService: FriendRequestService, private globalService : GlobalService, private storage : Storage) { 

    
  }

  resolve() {
   
    const dataSource: Observable<FriendRequestModel> = this.friendRequestService.getDataSource();
    const dataStore: DataStore<FriendRequestModel> = this.friendRequestService.getDataStore(dataSource);
    return dataStore;
  }
}
