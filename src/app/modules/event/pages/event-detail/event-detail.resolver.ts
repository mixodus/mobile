import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { EventsService } from '../../services/events.service';

@Injectable()
export class EventDetailResolver implements Resolve<any> {
  constructor(private _eventService: EventsService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const id = route.paramMap.get('id');

    return this._eventService.getSingleDataStore(id, true);
  }
}
