import { ShellModel } from '../../../shell/data-store';

export class AchievementsModel extends ShellModel {

    status: boolean;
    message: string;
    data: Array<{
        award_id: string;
        company_id: string;
        employee_id: string;
        award_type_id: string;
        gift_item: string;
        cash_price: string;
        award_photo: string;
        award_month_year: string;
        award_information: string;
        description: string;
        created_at: string;
        award_name: string;
        company_name: string;
    }> = [
            {
                award_id: '',
                company_id: '',
                employee_id: '',
                award_type_id: '',
                gift_item: '',
                cash_price: '',
                award_photo: '',
                award_month_year: '',
                award_information: '',
                description: '',
                created_at: '',
                award_name: '',
                company_name: '',
            }
        ]

    constructor() {
        super();
    }
}