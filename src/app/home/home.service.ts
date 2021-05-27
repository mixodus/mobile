import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/auth/authentication.service';
import { HomeModel } from './home.model';
import { DataStore } from '../shell/data-store';
import { GlobalService } from '../services/global.service';

@Injectable()
export class HomeService {
  public profileDataStore: DataStore<HomeModel>;
  public token = '';

  constructor(private http: HttpClient, private globalService: GlobalService, private auth: AuthenticationService) {
  }

  public getProfileDataSource(): Observable<HomeModel> {
    if (this.auth.token) {
      this.token = String(this.auth.token);
    }

    const headers = new HttpHeaders({
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': this.token
    });

    const options = { headers: headers };

    const homeEndpoint =
      this.globalService.apiUrl +
      'api/home';
    return this.http.get<HomeModel>(homeEndpoint, options);
  }
  public getCandidate(){
    if (this.auth.token) {
      this.token = String(this.auth.token);
    }

    const headers = new HttpHeaders({
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': this.token
    });

    const options = { headers: headers };

    const candidateEndpoint =
      this.globalService.apiUrl +
      'api/votes/candidates?topic_id=1';
      console.log(candidateEndpoint);
    return this.http.get<HomeModel>(candidateEndpoint, options);
  }
  public postVoteCandidate(postData: any){
    if (this.auth.token) {
      this.token = String(this.auth.token);
    }

    const headers = new HttpHeaders({
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': this.token
    });

    const options = { headers: headers };

    const voteCandidateEndpoint =
      this.globalService.apiUrl +
      'api/votes';
      console.log(voteCandidateEndpoint);
      console.log(postData);
    return this.http.post(voteCandidateEndpoint, postData ,options);
  }

  public postDeviceID(formData: any) {
    if (this.auth.token) {
      this.token = String(this.auth.token);
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': this.token,
    });
    const options = { headers: headers };

    const deviceIdEndpoint =
      this.globalService.apiUrl +
      'api/user/device_id';
    //console.log('berhasil post Device Id'+ formData);
    //console.log('Device ID Endpoint' + deviceIdEndpoint + options, {headers}), this.auth.token;

    return this.http.post(deviceIdEndpoint, formData, options);
    
} 

  public getProfileStore(dataSource: Observable<HomeModel>, refresh: boolean = false): DataStore<HomeModel> {
    var count = 0;
    // check apakah home perlu refresh 
    // jika tidak ambil datastore
    // Use cache if available
    if (!this.profileDataStore || this.globalService.refreshFlag.home || refresh) {
      // Initialize the model specifying that it is a shell model
      const shellModel: HomeModel = new HomeModel();
      this.profileDataStore = new DataStore(shellModel);
      // Trigger the loading mechanism (with shell) in the dataStore
      this.profileDataStore.load(dataSource);
      this.globalService.refreshFlag.home = false;
    }
    count++;
    return this.profileDataStore;
  }
}
