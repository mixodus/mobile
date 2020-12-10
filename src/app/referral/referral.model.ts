import { ShellModel } from '../shell/data-store'

export class ReferralModel extends ShellModel {

    status: boolean
    message: string
    data: Array<{
        referral_id: string,
        referral_name: string,
        referral_email: string,
        referral_contact_no: string,
        referral_status: string,
        referral_employee_id: string,
        created_at: string,
        modified_at: string,
    }> = [
            {
                referral_id: '',
                referral_name: '',
                referral_email: '',
                referral_contact_no: '',
                referral_status: '',
                referral_employee_id: '',
                created_at: '',
                modified_at: '',
            }
        ]

    constructor() {
        super();
    }
}