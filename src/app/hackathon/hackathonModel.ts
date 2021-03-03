export interface HackathonDetail {
  title: string;
  bannerUrl: string;
  description: string;
  prizes: Prize[];
  requirement: string;
  schedules: Schedule[];
  currentIndexSchedule: number;
  isJoinable: boolean;
  failedMessage: string;
  isComingSoon: boolean;
  commingSoonTitle: string;
  commingSoonMessage: string;
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
  nextScheduleDate: string;
  nextScheduleMessage: string;
  isDescriptionOpen: string;
}
