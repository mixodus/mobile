import { ShellModel } from '../../../../app/shell/data-store';

export class EducationModel extends ShellModel{
    status:boolean
    message: string
    data: Array<{qualification_id:string, name: string, education_level_id: string, education_level_name: string, field_of_study: string, start_period:string, end_period:string, gpa:string, description: string}> = [
        {
            qualification_id: '',
            name: '',
            education_level_id: '',
            education_level_name: '',
            field_of_study: '',
            start_period: '',
            end_period: '',
            gpa: '',
            description: ''
        }
    ]

    constructor(){
        super();
    }
}