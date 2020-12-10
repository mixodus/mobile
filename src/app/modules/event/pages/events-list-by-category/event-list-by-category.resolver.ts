import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { EventsService } from '../../services/events.service';

@Injectable()
export class EventsListTypeResolver implements Resolve<any> {
  constructor(private _eventsService: EventsService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const event_type = route.paramMap.get('event_type');

    return this._eventsService.getListTypeDataStore(event_type, true);
  }
}
