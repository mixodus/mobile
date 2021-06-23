import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from '../services/global.service';
import { AuthenticationService } from '../services/auth/authentication.service';
import { TopicModel } from './voting.model';

@Injectable()
export class VotingService {
    public token = '';

    constructor(private http: HttpClient, private globalService: GlobalService, private auth: AuthenticationService) {
    }

    public getTopicsSource(){
        if (this.auth.token) {
            this.token = String(this.auth.token);
          }
      
          const headers = new HttpHeaders({
            'X-Api-Key': this.globalService.getGlobalApiKey(),
            'X-Token': this.token
          });
      
          const options = { headers: headers };
      
          const challangeEndpoint =
            this.globalService.apiUrl +
            'api/votes/topics';
            console.log(challangeEndpoint);
          return this.http.get<TopicModel>(challangeEndpoint, options);
    }

}