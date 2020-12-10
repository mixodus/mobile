import { ShellModel } from '../../../../app/shell/data-store';

export class ProjectModel extends ShellModel {
    status: boolean
    message: string
    data: Array<{id:string, employee_id:string, work_experience_id:string, created_at:string, tools:string, project_name: string, start_period: string, end_period: string, position: string, jobdesc: string }> = [
        {
            id: '',
            employee_id: "",
            work_experience_id: "",
            project_name: "",
            start_period: "",
            position: "",
            jobdesc: "",
            created_at: "",
            end_period: "",
            tools: ''
        }
    ]

    constructor() {
        super();
    }
}