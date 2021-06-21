import { ShellModel } from '../shell/data-store';

export interface User {
  user_id: string;
  email: string;
  fullname: string;
  date_of_birth: string;
  gender: string;
  contact_no: string;
  address: string;
  marital_status: string;
  country: string;
  province: string;
  summary: string;
  job_title: string;
  profile_picture_url: string;
  points: number;
  cash: number;
  level_icon_url: string;
  level_name: string;
}

export interface Event {
  event_id: string;
  company_id: string;
  event_title: string;
  event_date: string;
  event_time: string;
  event_note: string;
  event_charge?: any;
  event_banner_url?: any;
  event_longitude?: any;
  event_latitude?: any;
  event_place?: any;
  created_at: string;
}

export interface News {
  news_id: string;
  news_title: string;
  news_type_id: string;
  news_url: string;
  news_photo: string;
  news_photo_url: string;
  news_colour: string;
  created_at: string;
  modified_at: string;
}

export interface Banner {
  banners_id: string;
  banners_type_id: string;
  banners_detail_id: string;
  banners_photo: string;
  created_at: string;
  modified_at: string;
  // banners_type: 'event' | 'news' | 'challenge';
  banners_type: string;
  banners_photo_url: string;
}

export interface FlyerBanner {
  is_active: false;
  url_banner: '';
}

export interface Job {
  job_id: string;
  company_id: string;
  job_title: string;
  designation_id: string;
  job_type: string;
  is_featured: string;
  job_vacancy: string;
  gender: string;
  minimum_experience: string;
  date_of_closing: string;
  short_description: string;
  long_description: string;
  status: string;
  created_at: string;
  company_name: string;
  country: string;
  province: string;
}

export interface Friend {
  user_id: string;
  fullname: string;
  profile_picture_url: string;
}

export interface Friend_List {
  data: Array<number>;
}

export interface Friend_Request {
  data: Array<number>;
}

export interface Info {
  api_version: number;
  url_download: string;
  max_fee_referral: string;
}

export interface VotingTopic{
  topic_id: string;
  name: string;
  title: string;
  banner_url: string;
}

export interface Data {
  count_applied_jobs: number;
  user: User;
  friends: Friend[];
  events: Event[];
  banner: Banner[];
  flyer_banner: FlyerBanner;
  news: News[];
  jobs: Job[];
  info: Info;
  friend_list: Friend_List;
  friend_request: Friend_Request;
  voting_topic: VotingTopic[];
}

export interface DataChallenge{
  challenge_id: number;
  challenge_title: string;
  challenge_point: number;
  challenge_photo: string;
}

export interface choices{
  name: string;
  total_vote: string;
  percentage: string;
}

export interface VoteResult{
  topic_id: string;
  name: string;
  title: string;
  choice: choices[];
}

export class ChallengeModel extends ShellModel {
  status: boolean;
  message: string;
  data: DataChallenge[];
}

export class VoteResultModel extends ShellModel{
  status: boolean;
  message: string;
  data: VoteResult;
}

export class HomeModel extends ShellModel {
  status: boolean;
  message: string;
  data: Data = {
    count_applied_jobs: 0,
    user: {
      user_id: '',
      email: '',
      fullname: '',
      date_of_birth: '',
      gender: '',
      contact_no: '',
      address: '',
      marital_status: '',
      country: '',
      province: '',
      summary: '',
      job_title: '',
      profile_picture_url: '',
      points: 0,
      cash: 0,
      level_icon_url: '',
      level_name: ''
    },
    friends: [
      {
        user_id: '',
        fullname: '',
        profile_picture_url: '',
      },
    ],
    banner: [
      {
        banners_id: '',
        banners_type_id: '',
        banners_detail_id: '',
        banners_photo: '',
        created_at: '',
        modified_at: '',
        banners_type: '',
        banners_photo_url: '',
      },
    ],
    flyer_banner: {
      is_active: false,
      url_banner: ''
    },
    events: [
      {
        event_id: '',
        company_id: '',
        event_title: '',
        event_date: '',
        event_time: '',
        event_note: '',
        event_charge: '',
        event_banner_url: '',
        event_longitude: '',
        event_latitude: '',
        event_place: '',
        created_at: '',
      },
    ],
    jobs: [
      {
        job_id: '',
        company_id: '',
        job_title: '',
        designation_id: '',
        job_type: '',
        is_featured: '',
        job_vacancy: '',
        gender: '',
        minimum_experience: '',
        date_of_closing: '',
        short_description: '',
        long_description: '',
        status: '',
        created_at: '',
        company_name: '',
        country: '',
        province: '',
      },
    ],
    news: [
      {
        news_id: '',
        news_title: '',
        news_type_id: '',
        news_url: '',
        news_photo: '',
        news_photo_url: '',
        news_colour: '',
        created_at: '',
        modified_at: '',
      },
    ],
    info: {
      api_version: 0,
      url_download: '',
      max_fee_referral: '',
    },
    friend_list: {
      data: [],
    },
    friend_request: {
      data: [],
    },
    voting_topic: [
      {
        topic_id: '',
        name: '',
        title: '',
        banner_url: '',
      },
    ],
  };

  constructor() {
    super();
  }
}
