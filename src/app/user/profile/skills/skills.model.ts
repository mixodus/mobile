import { ShellModel } from '../../../../app/shell/data-store';

export class SkillModel extends ShellModel {

    status: boolean;
    message: string;
    data: Array<{name:string}> = [
        {
            name: ''
        }
    ]

    constructor(){
        super();
    }
}
