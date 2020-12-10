import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  getNews() {
    const completeEndpoint =
      this._globalService.getApiUrl() +
      API_ENDPOINTS.News +
      `?X-Token=${this._auth.token}&X-Api-Key=${this._globalService.getGlobalApiKey()}`;

    return this._http.get<NewsResponse>(completeEndpoint);
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
    const url =
      this._globalService.apiUrl +
      '/api/home_news' +
      `?X-Api-Key=${this._globalService.getGlobalApiKey()}&X-Token=${this._auth.token}`;

    return this._http.get<NewsResponse>(url);
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
    const newsDetailEndpoint =
      this._globalService.getApiUrl() +
      'api/news/detail/' + newsDetailId +
      `?X-Api-Key=${this._globalService.getGlobalApiKey()}&X-Token=${this._auth.token}`;

    return this._http.get<NewsResponse>(newsDetailEndpoint);
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
