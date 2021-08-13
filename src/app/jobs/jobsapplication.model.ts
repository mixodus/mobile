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
  }>;

  constructor() {
    super();
  }
}
