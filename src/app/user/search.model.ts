import { ShellModel }from '../shell/data-store'

export interface Data{
    user_id:string;
    employee_id:string;
    office_shift_id:string;
    fullname:string;
}

export interface hmm{
    size:number;
    data:Data[];
}

export class SearchPeopleModel extends ShellModel{
    status: boolean;
    message: string;
    data:hmm={
        size:0,
        data:[
            {
                user_id:'',
                employee_id: '',
                office_shift_id: '',
                fullname:''
            }
        ]
    }
    
}