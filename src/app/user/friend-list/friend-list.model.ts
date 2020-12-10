import { ShellModel } from '../../../app/shell/data-store';

export interface mutual_friends{
    count: number,
    data: Array<number>
}

export class FriendListModel extends ShellModel{
    data: Array<{user_id:string, fullname:string, pic:string, mutual_friends:mutual_friends}> = [
        {
            user_id: '',
            fullname: '',
            pic: '',
            mutual_friends:{
                count: 0,
                data: []
            }
        }
    ]

    constructor(){
        super();
    }
}