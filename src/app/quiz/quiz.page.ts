import { Component, OnInit } from '@angular/core';
import { QuizModel } from './quiz.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NavController, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GlobalService } from '../services/global.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '../services/auth/authentication.service';
import { filter, finalize } from 'rxjs/operators';
import { Location } from '@angular/common';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.scss'],
})
export class QuizPage implements OnInit {

  questions: QuizModel;
  quizForm: FormGroup;

  i: number = 0;
  current_quiz_id: number;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private globalService: GlobalService,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private auth: AuthenticationService,
    private toast: ToastController,
    private alertController: AlertController,
    private location: Location,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.route.data.subscribe((resolvedRouteData) => {
        const detailsDataStore = resolvedRouteData['data'];

        detailsDataStore.state.subscribe(
          (state) => {
            console.log('state: ', state);
            this.questions = state;
            this.current_quiz_id = parseInt(this.questions.data[0].id);
          },
          (error) => {
          }
        );
      },
      (error) => {
      });

    this.quizForm = new FormGroup({
      quiz_answer: new FormControl('', Validators.required)
    });

    this.globalService.setPreviousPage('quiz');
  }

  async pause() {
    const alert = await this.alertController.create({
      header: 'Konfirmasi',
      message: 'Apakah kamu yakin ingin ingin jeda quiz? <br> *Kamu dapat kembali kapan saja',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
        }, {
          text: 'Ya',
          handler: (blah) => {
            this.navCtrl.pop();
          }
        }
      ]
    });

    await alert.present();
  }

  async next() {
    let loading = await this.loadingCtrl.create();
    await loading.present();
    let submitAnswer = this.quizForm.value;
    submitAnswer.quiz_id = this.current_quiz_id;

    console.log('submitAnswer: ', submitAnswer);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': `${this.auth.token}`
    });
    const options = { headers: headers };

    const quizChallengeEndpoint =
      this.globalService.apiUrl +
      'api/challenge/quiz';

    this.http.post(quizChallengeEndpoint, submitAnswer, options).pipe(
      finalize(() => this.loadingCtrl.dismiss())
    )
      .subscribe(data => {
        this.globalService.refreshFlag.challenge_detail = true;
        this.globalService.refreshFlag.home = true;
        this.globalService.refreshFlag.level = true;
        this.globalService.refreshFlag.leaderboard = true;
        this.current_quiz_id++;
        this.i++;
        this.quizForm.controls['quiz_answer'].reset();
      }, err => {

        let message = '';
        if (err.error.message === undefined) {
          message = 'Permasalahan jaringan, mohon coba lagi.';
        } else {
          message = err.error.message;
        }

        this.presentToast(message);
      });

  }

  async finish() {
    let loading = await this.loadingCtrl.create();
    await loading.present();
    let submitAnswer = this.quizForm.value;
    submitAnswer.quiz_id = this.current_quiz_id;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': `${this.auth.token}`
    });
    const options = { headers: headers };

    const quizChallengeEndpoint =
      this.globalService.apiUrl +
      'api/challenge/quiz';

    this.http.post(quizChallengeEndpoint, submitAnswer, options).pipe(
      finalize(() => this.loadingCtrl.dismiss())
    )
      .subscribe(data => {
        this.globalService.refreshFlag.challenge_detail = true;
        this.globalService.refreshFlag.home = true;
        this.globalService.refreshFlag.level = true;
        this.globalService.refreshFlag.leaderboard = true;
        this.quizForm.controls['quiz_answer'].reset();
        this.navCtrl.pop();
      }, err => {
        console.log('JS Call error: ', err);

        let message = '';
        if (err.error.message === undefined) {
          message = 'Permasalahan jaringan, mohon coba lagi.';
        } else {
          message = err.error.message;
        }

        this.presentToast(message);
      });
  }

  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

}
