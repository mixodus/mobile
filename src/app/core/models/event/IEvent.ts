import { IModel } from '../../interfaces/model-base/IModel';

export interface IEvent extends IModel {
  event_id: string;
  company_id: string;
  event_type_id: string;
  event_title: string;
  event_date: string;
  event_time: string;
  event_note: string;
  event_charge: string;
  event_banner: string;
  event_longitude: string;
  event_latitude: string;
  event_place: string;
  event_speaker: string;
  event_category?: string;
  event_registered?: boolean;
  event_ongoing?: string;
  status?: string;
  event_joinable?: string;
  status_event?: string
}
export interface IChallenge extends IModel {
  challenge_id: string,
  challenge_title: string,
  challenge_type_id: string,
  challenge_point: string,
  challenge_point_every_task: string,
  challenge_expired_date: string,
  challenge_description: string,
  challenge_long_description: string,
  challenge_photo: string,
  challenge_total_task: string,     
  challenge_icon_trophy: string,
  challenge_title_trophy: string,
  created_at: string,
  modified_at: string,
  event_category?: string,
  challenge_ongoing?: string,
  status_challenge?: string
}

export interface IOnGoingEventsandChallenge {
  ongoing_challenge: IChallenge[];
  ongoing_event: IEvent[];
}
