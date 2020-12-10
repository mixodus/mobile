import { ShellModel } from '../shell/data-store';

export interface Datum {
    id: string;
    challenge_id: string;
    question: string;
    a: string;
    b: string;
    c: string;
}

export class QuizModel extends ShellModel {

    status: boolean;
    message: string;
    data: Datum[] = [
        {
            id: '',
            challenge_id: '',
            question: '',
            a: '',
            b: '',
            c: '',
        }
    ]

    constructor() {
        super();
    }
}