import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { QuizService } from './quiz.service';

@Injectable()
export class QuizResolver implements Resolve<any>{
    constructor(private quizService: QuizService){

    }

    resolve(route: ActivatedRouteSnapshot) {
        const quiz_id = route.params['id'];
        const dataSource = this.quizService.getQuizDataSource(quiz_id)
        const dataStore = this.quizService.getQuizStore(dataSource);

        return dataStore;
    }
}