import { Injectable } from "@angular/core";
import { DataStore } from '../shell/data-store';
import { QuizModel } from './quiz.model';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/auth/authentication.service';
import { Storage } from '@ionic/storage';
import { GlobalService } from '../services/global.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class QuizService {
    quizDataStore: DataStore<QuizModel>;

    constructor(private http: HttpClient, private globalService: GlobalService, private storage: Storage, private auth: AuthenticationService) {

    }

    getQuizDataSource(id: string): Observable<QuizModel> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Api-Key': this.globalService.getGlobalApiKey(),
            'X-Token': `${this.auth.token}`
        });
        const options = { headers: headers };

        const quizChallengeEndpoint =
          this.globalService.apiUrl +
          'api/challenge/quiz' + '?challenge_id=' + id;

        return this.http.get<QuizModel>(quizChallengeEndpoint, options);
    }

    getQuizStore(dataSource: Observable<QuizModel>): DataStore<QuizModel> {

        // Initialize the model specifying that it is a shell model
        const shellModel: QuizModel = new QuizModel();
        this.quizDataStore = new DataStore(shellModel);
        // Trigger the loading mechanism (with shell) in the dataStore
        this.quizDataStore.load(dataSource);

        return this.quizDataStore;
    }
}
