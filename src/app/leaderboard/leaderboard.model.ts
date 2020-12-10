import { ShellModel } from '../shell/data-store';

export interface Data {
    total_point: string;
    month: string;
    employee_id: string;
    fullname: string;
    profile_picture: string;
    profile_picture_url: string;
}

export class LeaderboardModel extends ShellModel {
    status: boolean;
    message: string;
    data: Data[] = [
        {
            total_point: '',
            month: '',
            employee_id: '',
            fullname: '',
            profile_picture: '',
            profile_picture_url: '',
        }
    ];

    constructor(){
        super();
    }
}