export interface HackathonDetail {
  title: string;
  bannerUrl: string;
  description: string;
  prizes: Prize[];
  requirement: string;
  schedules: Schedule[];
  currentSchedule: Schedule;
}

interface Prize {
  name: string;
  reward: string;
  rewardIconUrl: string;
}

interface Schedule {
  name: string;
  iconUrl: string;
  iconStatusUrl: string;
  startDate: string;
  status: string;
  description: string;
}
