import { Injectable } from "@angular/core";
import { DataStore } from '../shell/data-store';
import { QuizModel } from './quiz.model';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/auth/authentication.service';
import { Storage } from '@ionic/storage';
import { GlobalService } from '../services/global.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class QuizService {
    quizDataStore: DataStore<QuizModel>;

    constructor(private http: HttpClient, private globalService: GlobalService, private storage: Storage, private auth: AuthenticationService) {

    }

    getQuizDataSource(id: string): Observable<QuizModel> {
        let token = this.auth.token;

        let url = this.globalService.getApiUrl() + 'api/challenge/quiz?X-Api-Key=' + this.globalService.getGlobalApiKey() + '&X-Token=' + token + '&challenge_id=' + id;
        return this.http.get<QuizModel>(url);
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