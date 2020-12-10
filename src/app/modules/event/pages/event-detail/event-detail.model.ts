import { ShellModel } from '../../../../shell/data-store';

export class EventDetailsModel extends ShellModel {
  image: string;
  icon: string;
  event_id: number;
  event_title: string;
  event_place: string;
  event_note: string;
  event_date: string;
  event_time: string;
  event_banner_url: string;
  category: string;
  shortDescription: string;
  speaker: string;
  event_is_join: boolean;
  event_join_status: string;
  rating: number;
  reviewsCount: number;
  tags: Array<string> = new Array(3).fill('');
  fullDescription: string;
  openHours: Array<{ day: string; open: boolean; hourFrom: string; hourTo: string }> = [
    {
      day: '',
      open: true,
      hourFrom: '',
      hourTo: '',
    },
    {
      day: '',
      open: true,
      hourFrom: '',
      hourTo: '',
    },
    {
      day: '',
      open: false,
      hourFrom: '',
      hourTo: '',
    },
  ];
  location: {
    address: string;
    city: string;
    latlng: string;
    mapImage: string;
  };
  whereToStay: Array<{ picture: string; name: string; rating: number }> = [
    {
      picture: '',
      name: '',
      rating: null,
    },
    {
      picture: '',
      name: '',
      rating: null,
    },
    {
      picture: '',
      name: '',
      rating: null,
    },
  ];
  whereToEat: Array<{ picture: string; name: string; rating: number }> = [
    {
      picture: '',
      name: '',
      rating: null,
    },
    {
      picture: '',
      name: '',
      rating: null,
    },
    {
      picture: '',
      name: '',
      rating: null,
    },
  ];
  relatedActivities: Array<{ picture: string; name: string; category: string; rating: number }> = [
    {
      picture: '',
      name: '',
      category: '',
      rating: null,
    },
    {
      picture: '',
      name: '',
      category: '',
      rating: null,
    },
  ];

  constructor() {
    super();
  }
}
