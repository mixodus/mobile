import { ShellModel } from '../shell/data-store';

export class JobsApplicationModel extends ShellModel {
  status: boolean;
  message: string;
  data: Array<{
    application_id: string;
    job_id: string;
    job_title: string;
    user_id: string;
    application_status: string;
    application_remarks: string;
    date_of_closing: string;
    company_name: string;
    created_at: string;
    company_logo_url: string;
    country: string;
    province: string;
  }> = [
    {
      application_id: '',
      job_id: '',
      job_title: '',
      user_id: '',
      application_status: '',
      application_remarks: '',
      date_of_closing: '',
      company_name: '',
      created_at: '',
      company_logo_url: '',
      province: '',
      country: '',
    },
  ];

  constructor() {
    super();
  }
}
