import * as dayjs from 'dayjs';

import { ShellModel } from '../shell/data-store';

export class ChallengesModel extends ShellModel {
    status: string;
    message: string;
    data: Array<{
        challenge_id: string,
        challenge_title: string,
        challenge_type_id: string,
        challenge_point: string,
        challenge_point_every_task: string,
        challenge_expired_date: string,
        challenge_description: string,
        challenge_long_description: string,
        challenge_photo: string,
        challenge_total_task: string,
        challenge_icon_trophy: string,
        challenge_title_trophy: string,
        created_at: string,
        modified_at: string,
        event_category: string,
        challenge_ongoing: string,
    }> = [
            {
                challenge_id: '',
                challenge_title: '',
                challenge_type_id: '',
                challenge_point: '',
                challenge_point_every_task: '',
                challenge_expired_date: '',
                challenge_description: '',
                challenge_long_description: '',
                challenge_photo: '',
                challenge_total_task: '',
                challenge_icon_trophy: '',
                challenge_title_trophy: '',
                created_at: '',
                modified_at: '',
                event_category: '',
                challenge_ongoing: '',
            }
        ];

    constructor() {
        super();
    }
}
