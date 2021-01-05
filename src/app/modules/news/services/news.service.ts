import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from '../../../services/global.service';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';
import { DataStore } from '../../../shell/data-store';
import { NewsResponse } from '../../../core/models/news/NewsResponse';
import { AuthenticationService } from '../../../services/auth/authentication.service';

@Injectable()
export class NewsService {
  constructor(
    private _http: HttpClient,
    private _globalService: GlobalService,
    private _auth: AuthenticationService
  ) {
  }

  private _listDataStore: DataStore<NewsResponse>;
  private _bannerDataStore: DataStore<NewsResponse>;
  private _newsDetailDataStore: DataStore<NewsResponse>;

  // this._auth.token
  getNews() {
    console.log('this._auth.token: ', this._auth.token)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this._globalService.getGlobalApiKey(),
      'X-Token': `${this._auth.token}`
    });
    const options = { headers: headers };

    const completeEndpoint =
      this._globalService.getApiUrl() +
      API_ENDPOINTS.News

    return this._http.get<NewsResponse>(completeEndpoint, options);
  }

  getNewsDataStore(refresh: boolean = false) {
    // Use cache if available
    if (!this._listDataStore || refresh) {
      const shellModel: NewsResponse = new NewsResponse();
      this._listDataStore = new DataStore(shellModel);
      // Trigger the loading mechanism (with shell) in the dataStore
      this._listDataStore.load(this.getNews());
      console.log('this.getNews(): ', this.getNews());
    }
    return this._listDataStore;
  }

  getBanner() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this._globalService.getGlobalApiKey(),
      'X-Token': `${this._auth.token}`
    });
    const options = { headers: headers };

    const bannerEndpoint =
      this._globalService.apiUrl +
      'api/home_news';

    return this._http.get<NewsResponse>(bannerEndpoint, options);
  }

  getBannerDataStore(refresh: boolean = false) {
    // Use cache if available
    if (!this._bannerDataStore || refresh) {
      const shellModel: NewsResponse = new NewsResponse();
      this._bannerDataStore = new DataStore(shellModel);
      // Trigger the loading mechanism (with shell) in the dataStore
      this._bannerDataStore.load(this.getBanner());
    }
    return this._bannerDataStore;
  }

  getNewsDetail(newsDetailId: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this._globalService.getGlobalApiKey(),
      'X-Token': `${this._auth.token}`
    });
    const options = { headers: headers };

    const newsDetailEndpoint =
      this._globalService.apiUrl +
      'api/news/detail/' + newsDetailId;

    return this._http.get<NewsResponse>(newsDetailEndpoint, options);
  }

  getNewsDetailDateStore(newsDetailId: string, refresh: boolean = false) {
    if (!this._newsDetailDataStore || refresh) {
      const shellModel: NewsResponse = new NewsResponse();
      this._newsDetailDataStore = new DataStore(shellModel);
      this._newsDetailDataStore.load(this.getNewsDetail(newsDetailId));
    }

    return this._newsDetailDataStore;
  }
}
