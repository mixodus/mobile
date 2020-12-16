import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { NewsService } from '../../services/news.service';

@Injectable()
export class NewsDetailResolver implements Resolve<any> {
  constructor(private _newsService: NewsService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const news_id = route.params['news-id'];
    console.log('this._newsService.getNewsDetailDateStore(news_id): ', this._newsService.getNewsDetailDateStore(news_id));
    return this._newsService.getNewsDetailDateStore(news_id);
  }
}
