import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { EventsService } from '../../../services/events.service';

@Injectable()
export class EventsListResolver implements Resolve<any> {
  constructor(private _eventsService: EventsService) {}

  resolve() {
    return this._eventsService.getListDataStore();
  }
}
