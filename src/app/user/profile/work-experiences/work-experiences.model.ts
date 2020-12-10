import { ShellModel } from '../../../../app/shell/data-store';

export class WorkExperienceModel extends ShellModel{
    status: boolean;
    message: string;
    data: Array<{work_experience_id :string, employee_id :string, company_name:string, start_period:string, end_period:string, post:string, description:string}> = [
        {
            work_experience_id: '',
            employee_id: '',
            company_name: '',
            start_period: '',
            end_period: '',
            post: '',
            description: ''
        }
    ]
    constructor() {
        super();
      }
}