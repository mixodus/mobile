import { ShellModel } from '../../shell/data-store';

export class UserProfileModel extends ShellModel {
  profile_picture: string;
  fullname: string;
  membership: string;
  job_title: string;
  email: string;
  province: string;
  country: string;
  summary: string;
  date_of_birth: string;
  marital_status: string;
  gender: string;
  zip_code: string;
  address: string;
  contact_no: string;
  skill_text: string = '';
  profile_picture_url: string;
  status_email: boolean;
  level_icon_url: string;
  total_achievement: string;
  friends: Array<{ image: string, name: string }> = [
    {
      image: '',
      name: ''
    },
    {
      image: '',
      name: ''
    },
    {
      image: '',
      name: ''
    },
    {
      image: '',
      name: ''
    }
  ];
  // skills: Array<{name: string}> = [
  //   {
  //     name: ''
  //   },
  //   {
  //     name: ''
  //   },
  //   {
  //     name: ''
  //   },
  //   {
  //     name: ''
  //   },
  // ]
  photos: Array<string> = [
    '',
    '',
    '',
    ''
  ];
  project: Array<{ project_name: string, start_period: string, end_period: string, position: string, jobdesc: string }> = [
    {
      project_name: '',
      start_period: '',
      end_period: '',
      position: '',
      jobdesc: ''
    }
  ];

  work_experience: Array<{ company_name: string, start_period: string, end_period: string, post: string, description: string }> = [
    {
      company_name: '',
      start_period: '',
      end_period: '',
      post: '',
      description: ''
    }
  ];
  certification: Array<{ certification_id: string, employee_id: string, certification_date: string, title: string, description: string, certification_file: string }> = [
    {
      certification_id: '',
      employee_id: '',
      certification_date: '',
      title: '',
      description: '',
      certification_file: ''
    }
  ];

  qualification: Array<{ name: string, education_level_name: string, field_of_study: string, start_period: string, end_period: string, description: string }> = [
    {
      name: '',
      education_level_name: '',
      field_of_study: '',
      start_period: '',
      end_period: '',
      description: ''
    }
  ];

  history: Array<{ event_done: string, bootcamp_done: string, challenge_done: string }> = [
    {
      event_done: '',
      bootcamp_done: '',
      challenge_done: ''
    }
  ];

  achievements: Array<{ image: string, name: string, point: number }> = [
    {
      image: '',
      name: '',
      point: 0,
    },
    {
      image: '',
      name: '',
      point: 0,
    },
    {
      image: '',
      name: '',
      point: 0,
    },
    {
      image: '',
      name: '',
      point: 0,
    },
    {
      image: '',
      name: '',
      point: 0,
    },
    {
      image: '',
      name: '',
      point: 0,
    },
    {
      image: '',
      name: '',
      point: 0,
    },
    {
      image: '',
      name: '',
      point: 0,
    },
    {
      image: '',
      name: '',
      point: 0,
    },
    {
      image: '',
      name: '',
      point: 0,
    },
    {
      image: '',
      name: '',
      point: 0,
    },
    {
      image: '',
      name: '',
      point: 0,
    }
  ];

  is_friend: boolean;
  requested: boolean;
  constructor() {
    super();
  }
}
