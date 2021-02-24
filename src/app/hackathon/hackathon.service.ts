import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NewsResponse } from '../core/models/news/NewsResponse';
import { GlobalService } from '../services/global.service';
import { AuthenticationService } from '../services/auth/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class HackathonService {
  token = '';

  constructor(
    private http: HttpClient,
    private globalService: GlobalService,
    private auth: AuthenticationService
  ) {
  }

  getHackathonDetailData() {
    if (this.auth.token) {
      this.token = String(this.auth.token);
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': this.token
    });
    const options = { headers: headers };

    const hackathonDetailEndpoint =
      this.globalService.apiUrl +
      'api/event/hackathon';

    return this.http.get<NewsResponse>(hackathonDetailEndpoint, options);
  }

  formattingHackathonDetail(unformattedHackathonDetail: any) {
    return {
      title: unformattedHackathonDetail.event_title,
      bannerUrl: unformattedHackathonDetail.event_banner_url,
      description: unformattedHackathonDetail.event_note,
      prizes: this.extractingHackathonDetail(unformattedHackathonDetail.event_prize),
      requirement: unformattedHackathonDetail.event_requirement,
      schedules: this.extractingSchedules(unformattedHackathonDetail.eventSchedules),
      currentIndexSchedule: this.findCurrentIndexSchedule(unformattedHackathonDetail.eventSchedules),
      isJoinable: unformattedHackathonDetail.event_joinable,
      failedMessage: unformattedHackathonDetail.failed_message ? unformattedHackathonDetail.failed_message : '',
      isComingSoon: unformattedHackathonDetail.event_coming_soon,
      commingSoonTitle: unformattedHackathonDetail.event_coming_soon_title,
      commingSoonMessage: unformattedHackathonDetail.event_coming_soon_message
    };
  }

  extractingHackathonDetail(unformattedPrizes: any[]) {
    const extractedPrizes = [];

    unformattedPrizes.forEach((prize: any) => {
      extractedPrizes.push(
        {
          name: prize.name,
          reward: prize.reward_value,
          rewardIconUrl: prize.reward_icon_url
        }
      );
    });
    return extractedPrizes;
  }

  extractingSchedules(unformattedSchedules: any[]) {
    const extractedPrizes = [];

    unformattedSchedules.forEach((schedule: any) => {
      extractedPrizes.push(
        {
          name: schedule.name,
          iconUrl: schedule.icon_url,
          iconStatusUrl: schedule.icon_status_url,
          startDate: schedule.schedule_start,
          status: schedule.status,
          description: schedule.desc,
          nextScheduleDate: schedule.next_schedule_date,
          nextScheduleMessage: schedule.next_schedule_message
        }
      );
    });
    return extractedPrizes;
  }

  findCurrentIndexSchedule(unformattedSchedules: any[]) {
    return unformattedSchedules.findIndex((schedule) => schedule.is_current_state === true);
  }
}
