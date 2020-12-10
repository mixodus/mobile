import * as dayjs from 'dayjs';

import { ShellModel } from '../../shell/data-store';

export class ChallengeDetailModel extends ShellModel {
    status: string;
    message: string;
    data =
    {
        challenge_id: '',
        challenge_title: '',
        challenge_type_id: '',
        challenge_point: '',
        challenge_expired_date: '',
        challenge_description: '',
        challenge_long_desciption: '',
        challenge_photo: '',
        challenge_total_task: '',
        me: {
            id: '',
            challenge_id: '',
            list_quiz_id: '',
            list_quiz_answer: '',
            employee_id: '',
            created_at: '',
            modified_at: '',
            total_point: '',
            total_current_point: '',
            total_current_task: '',
            total_task: '',
            is_achieve: '',
        },
        top_participant:[
            {
                challenge_id: '',
                fullname: '',
                profile_picture_url: '',
                total_current_point: '',
                total_point: '',
                employee_id: '',
            }
        ]
    }

    constructor() {
        super();
    }
}
