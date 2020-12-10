import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { HistoryService } from './history.service';

@Injectable()
export class EventResolver implements Resolve<any> {
  constructor(private _historyService: HistoryService) {}
  
  resolve(route: ActivatedRouteSnapshot) {
    const event_type = route.paramMap.get('event_type');
    return this._historyService.getEventDataStore(event_type, true);
  }
}
