import { EventsService } from '../../services/events.service';
import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class ProfileResolver implements Resolve<any> {
  constructor(private _eventsService: EventsService) {}

  resolve() {
    return this._eventsService.getProfileDataStore(true);
  }
}