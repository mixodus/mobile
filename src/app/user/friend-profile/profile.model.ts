import { ShellModel } from '../../shell/data-store';

export interface Data{
    user_id: string;
    fullname: string;
    pic: string;
}
export interface mutual_friends{
    count: number;
    data: Data[];
}

export class FriendProfileModel extends ShellModel {
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
    profile_picture_url:string;
    level_icon_url:string;
    work_experience: Array<{ work_experience_id: string, company_name: string, start_period: string, end_period: string, post: string, description: string }> = [
        {
            work_experience_id: "",
            company_name: "",
            start_period: "",
            end_period: "",
            post: "",
            description: ""
        }
    ];
    qualification: Array<{ qualification_id: string, name: string, description: string, gpa: string, field_of_study: string, start_period: string, end_period: string, education_level_name: string }> = [
        {
            qualification_id: "",
            name: "",
            description: "",
            gpa: "",
            field_of_study: "",
            start_period: "",
            end_period: "",
            education_level_name: ""
        }
    ];
    project: Array<{ id: string, project_name: string, start_period: string, end_period: string, position: string, jobdesc: string }> = [
        {
            id: '',
            project_name: '',
            start_period: '',
            end_period: '',
            position: '',
            jobdesc: ''
        }
    ];
    friendship_status: number;
    mutual_friends: mutual_friends={
        count: 0,
        data:[
        {
            user_id: '',
            fullname: '',
            pic: ''
        }
        ]
    }

    constructor() {
        super();
    }
}
