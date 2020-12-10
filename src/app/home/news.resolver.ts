import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { NewsService } from '../modules/news/services/news.service';

@Injectable()
export class NewsResolver implements Resolve<any> {
  constructor(private _newsService: NewsService) {}

  resolve() {
    return this._newsService.getNewsDataStore();
  }
}