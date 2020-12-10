import { Injectable } from '@angular/core';
import { DataStore } from '../../shell/data-store';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../services/global.service';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { Observable } from 'rxjs';
import { FriendRequestModel } from './friend-request.model';

@Injectable({
    providedIn: 'root'
})
export class FriendRequestService {
    private FriendRequestStore: DataStore<FriendRequestModel>

    constructor(private http: HttpClient, private globalService: GlobalService, private storage: Storage, private auth: AuthenticationService) { }

    public getDataSource(){
        let token = this.auth.token;

        let url = this.globalService.getApiUrl() + 'friend/list_friend_request?X-Api-Key=' + this.globalService.getGlobalApiKey() + '&X-Token=' + token;
        return this.http.get<FriendRequestModel>(url);
    }

    public getDataStore(dataSource: Observable<FriendRequestModel>): DataStore<FriendRequestModel> {

        if(!this.FriendRequestStore || this.globalService.refreshFlag.friend_request){
            const shellModel: FriendRequestModel= new FriendRequestModel();
            this.FriendRequestStore = new DataStore(shellModel);

            this.FriendRequestStore.load(dataSource);

            this.globalService.refreshFlag.friend_request = false;
        }

        return this.FriendRequestStore;

    }
}