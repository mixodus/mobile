import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HomeService } from './home.service';
import { Observable } from 'rxjs';
import { DataStore } from '../shell/data-store';
import { HomeModel } from './home.model';

@Injectable()
export class HomeResolver implements Resolve<any> {

  constructor(private homeService: HomeService) {
  }

  resolve() {
    const dataSource: Observable<HomeModel> = this.homeService.getProfileDataSource();
    const dataStore: DataStore<HomeModel> = this.homeService.getProfileStore(dataSource);
    return dataStore;
  }
}
