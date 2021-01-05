import { Injectable } from '@angular/core';
import { DataStore } from '../../shell/data-store';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from '../../services/global.service';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { Observable } from 'rxjs';
import { FriendListModel } from './friend-list.model';

@Injectable({
    providedIn: 'root'
})
export class FriendListService {
    private FriendListStore: DataStore<FriendListModel>

    constructor(private http: HttpClient, private globalService: GlobalService, private storage: Storage, private auth: AuthenticationService) { }

    public getDataSource(){
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Api-Key': this.globalService.getGlobalApiKey(),
            'X-Token': `${this.auth.token}`
        });
        const options = { headers: headers };

        const getFriendEndpoint =
          this.globalService.apiUrl +
          'friend/list';

        return this.http.get<FriendListModel>(getFriendEndpoint, options);
    }

    public getDataStore(dataSource: Observable<FriendListModel>): DataStore<FriendListModel> {

        if(!this.FriendListStore || this.globalService.refreshFlag.friend_list){
            const shellModel: FriendListModel= new FriendListModel();
            this.FriendListStore = new DataStore(shellModel);

            this.FriendListStore.load(dataSource);

            this.globalService.refreshFlag.friend_list = false;
        }

        return this.FriendListStore;

    }
}
