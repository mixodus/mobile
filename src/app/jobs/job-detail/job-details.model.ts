import { ShellModel } from '../../shell/data-store';

export class JobDetailsModel extends ShellModel {
  status: boolean;
  message: string;
  data = {
    job_id: '',
    company_name: '',
    job_title: '',
    designation_name: '',
    short_description: '',
    long_description: '',
    job_type_name: '',
    job_vacancy: '',
    date_of_closing: '',
    province: '',
    country: '',
    company_logo_url: '',
    status: false,
    is_applied: false,
    created_at: '',
  };

  constructor() {
    super();
  }
}
