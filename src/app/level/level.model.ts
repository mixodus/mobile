import { ShellModel } from '../shell/data-store';

export interface Data {
    level_id: string;
    level_name: string;
    level_code: string;
    level_icon: string;
    level_min_point: string;
    level_max_point: string;
    created_at: string;
    modified_at: string;
    is_passed: boolean;
    level_icon_url: string;
    is_accomplished: boolean;
}

export interface CurrentLevel {
    level_id: string;
    level_name: string;
    level_code: string;
    level_icon: string;
    level_min_point: number;
    level_max_point: number;
    created_at: string;
    modified_at: string;
    is_passed: boolean;
    level_icon_url: string;
    is_accomplished: boolean;
}

export interface User {
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
    profile_picture: string;
    zip_code: string;
    cash: string;
    points: number;
    skill_text: string;
    profile_picture_url?: any;
}

export class LevelModel extends ShellModel {

    status: boolean;
    message: string;
    data: Data[] = [
        {
            level_id: '',
            level_name: '',
            level_code: '',
            level_icon: '',
            level_min_point: '',
            level_max_point: '',
            created_at: '',
            modified_at: '',
            is_passed: false,
            level_icon_url: '',
            is_accomplished: false
        }
    ];
    current_level: CurrentLevel = {
        level_id: '',
        level_name: '',
        level_code: '',
        level_icon: '',
        level_min_point: 0,
        level_max_point: 0,
        created_at: '',
        modified_at: '',
        is_passed: false,
        level_icon_url: '',
        is_accomplished: false
    };
    user: User = {
        user_id: '',
        email: '',
        fullname: '',
        date_of_birth: '',
        gender: '',
        contact_no: '',
        address: '',
        marital_status: '',
        country: '',
        province: '',
        summary: '',
        job_title: '',
        profile_picture: '',
        zip_code: '',
        cash: '',
        points: 0,
        skill_text: '',
        profile_picture_url: '',
    };

    constructor() {
        super();
    }
}
