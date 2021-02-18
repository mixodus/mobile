import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NewsResponse } from '../../../core/models/news/NewsResponse';
import { GlobalService } from '../../../services/global.service';
import { AuthenticationService } from '../../../services/auth/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class TermsConditionsService {
  token = '';

  constructor(
    private http: HttpClient,
    private globalService: GlobalService,
    private auth: AuthenticationService
  ) {
  }

  getTermsConditions() {
    if (this.auth.token) {
      this.token = String(this.auth.token);
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': this.token
    });
    const options = { headers: headers };

    const hackathonTermsConditionsEndpoint =
      this.globalService.apiUrl +
      'api/event/hackathon/terms-condition';

    return this.http.get<NewsResponse>(hackathonTermsConditionsEndpoint, options);
  }

  formattingTermsConditions(unformattedTermsConditions: any) {
    return {
      title: unformattedTermsConditions.event_label_terms_conditions,
      description: unformattedTermsConditions.event_terms_conditions
    };
  }
}
