import { IEvent, IOnGoingEventsandChallenge } from './IEvent';
import { IResponse } from '../../interfaces/model-base/IResponse';

export class EventsResponse implements IResponse<IEvent[]> {
  status = false;
  data: IEvent[] = [];
  error = null;
  message = null;
  
}
export class OnGoingEventListResponse implements IResponse<IOnGoingEventsandChallenge> {
  status = false;
  data = {
    ongoing_event: [],
    ongoing_challenge: []
  };
  error = null;
  message = null;
}
