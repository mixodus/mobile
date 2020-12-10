import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { EventsService } from '../events.service';
import { EventDetailsModel } from './event-details.model';
import { Observable } from 'rxjs';
import { DataStore } from '../../shell/data-store';

@Injectable()
export class EventDetailsResolver implements Resolve<any> {
  event_note:string;
  event_id:number;
  event_banner_url:string;
  icon:string;
  event_title:string;
  event_date:string;
  event_time:string;
  event_speaker:string;
  event_place:string;
  event_charge:string;
  event_join_status:string;
  event_is_join:boolean;
  constructor(private eventsService: EventsService) {}

  resolve() {
    const dataSource: Observable<EventDetailsModel> = this.eventsService.getDetailsDataSource();
    const dataStore: DataStore<EventDetailsModel> = this.eventsService.getDetailsStore(dataSource);

    return dataStore;
  }
}
