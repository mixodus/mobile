import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataStore } from '../shell/data-store';
import { ChallengesModel } from './challenges.model';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/auth/authentication.service';
import { GlobalService } from '../services/global.service';
import { ChallengeDetailModel } from './challenge-detail/challenge-detail.model';

@Injectable()
export class ChallengesService {
  private challengesDataStore: DataStore<ChallengesModel>;
  private challengeDetailDataStore: DataStore<ChallengeDetailModel>;

  constructor(private http: HttpClient, private auth: AuthenticationService, private globalService: GlobalService) {
  }

  public getChallengesDataSource(): Observable<ChallengesModel> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': `${this.auth.token}`
    });

    const options = { headers: headers};

    const challengeEndpoint =
      this.globalService.apiUrl +
      'api/challenge';

    return this.http.get<ChallengesModel>(challengeEndpoint, options);
    // return this.http.get<ChallengesModel>('./assets/sample-data/deals/listing.json');
  }

  public getChallengesStore(dataSource: Observable<ChallengesModel>, refresh: boolean = false): DataStore<ChallengesModel> {
    // Use cache if available
    if (!this.challengesDataStore || this.globalService.refreshFlag.challenge || refresh) {
      // Initialize the model specifying that it is a shell model
      const shellModel: ChallengesModel = new ChallengesModel();
      this.challengesDataStore = new DataStore(shellModel);
      // Trigger the loading mechanism (with shell) in the dataStore
      this.challengesDataStore.load(dataSource);
      this.globalService.refreshFlag.challenge = false;
    }
    return this.challengesDataStore;
  }

  public getChallengeDetailDataSource(challenge_id: string): Observable<ChallengeDetailModel> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': `${this.auth.token}`
    });

    const options = { headers: headers };

    const challengeDetailEndpoint =
      this.globalService.apiUrl +
      'api/challenge/detail/' + challenge_id;

    return this.http.get<ChallengeDetailModel>(challengeDetailEndpoint, options);
  }

  public getChallengeDetailStore(dataSource: Observable<ChallengeDetailModel>): DataStore<ChallengeDetailModel> {
    // Use cache if available
    if (!this.challengeDetailDataStore || this.globalService.refreshFlag.challenge_detail) {
      // Initialize the model specifying that it is a shell model
      const shellModel: ChallengeDetailModel = new ChallengeDetailModel();
      this.challengeDetailDataStore = new DataStore(shellModel);
      // Trigger the loading mechanism (with shell) in the dataStore
      this.challengeDetailDataStore.load(dataSource);
      this.globalService.refreshFlag.challenge_detail = false;
    }
    return this.challengeDetailDataStore;
  }
}
