import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { FriendListService } from './friend-list.service';
import { Observable } from 'rxjs';
import { DataStore } from '../../shell/data-store';
import { FriendListModel } from './friend-list.model';
import { GlobalService } from '../../services/global.service';
import { Storage } from '@ionic/storage';
@Injectable()
export class FriendListResolver implements Resolve<any> {
  token : String;
  constructor(private friendListService: FriendListService, private globalService : GlobalService, private storage : Storage) { 

    
  }

  resolve() {
   
    const dataSource: Observable<FriendListModel> = this.friendListService.getDataSource();
    const dataStore: DataStore<FriendListModel> = this.friendListService.getDataStore(dataSource);
    return dataStore;
  }
}
