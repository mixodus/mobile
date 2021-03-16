import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LoadingController, AlertController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { GlobalService } from '../global.service';
import * as dayjs from 'dayjs';

const TOKEN_KEY = 'idstar-token';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  user: Observable<any>;
  token: String;
  public authState = new BehaviorSubject(null);
  isInitialLogin: boolean;

  constructor(
    private storage: Storage,
    private router: Router,
    private loadingCtrl: LoadingController,
    private http: HttpClient,
    private globalService: GlobalService,
    private alertCtrl: AlertController
  ) {
    this.loadUser();
    this.user = this.authState.asObservable().pipe(filter((response) => response));
  }

  loadUser() {
    this.storage.get(TOKEN_KEY).then((data) => {
      if (data) {
        this.authState.next(data);
        this.token = data.token;
      } else {
        this.authState.next({ token: null });
      }
    });
  }

  async signIn(credential) {
    let email = credential.email;
    let password = credential.password;
    let user = null;

    let postdata = { username: email, password: password };
    // normaly posting login to API Server
    let loading = await this.loadingCtrl.create();
    await loading.present();
    this.http
      .post('http://localhost/idstar/user/login?X-Api-Key=idstar123!', postdata)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe(
        (data) => {
          // this.data = data['results'];
          this.authState.next(data);
          this.storage.set(TOKEN_KEY, data);
        },
        (err) => {
          console.log('JS Call error: ', err);
        }
      );
  }

  public getTokenName() {
    return TOKEN_KEY;
  }

  setSignIn(dataUser) {
    this.changeIsInitialLogin(true);
    let user = dataUser.data;
    let count = 0;
    this.authState.next(user);
    this.token = user.token;
    this.storage.set(this.globalService.getTokenName(), user);
    localStorage.setItem(this.globalService.getTokenName(), user.token);
    let now = dayjs();
    localStorage.setItem(this.globalService.getParamLoginTime(), now.format());
    localStorage.setItem(this.globalService.getParamExpirationTime(), user.expiration.second);
    return of(user);
  }

  setSignInManual() {
    let user = { token: '12361283621', user: { fullname: 'Hendra Ramdhan' } };
    this.authState.next(user);
    this.storage.set(TOKEN_KEY, user);
    return of(user);
  }

  checkExpiredToken() {
    const headers = new HttpHeaders({
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': String(this.token)
    });

    const options = { headers: headers };

    const checkSessionEndpoint =
      this.globalService.apiUrl +
      'api/home/check_session';

    this.http.get(checkSessionEndpoint, options).subscribe(
      (response) => {
        //process the json data
      },
      (error) => {
        // console.log("error di check session");
        if (error.error.message === 'Expired token') {
          this.presentAlert();
        }
      }
    );
    let currentDate = dayjs();

    if (localStorage.getItem(this.globalService.getParamLoginTime()) === null) {
      // this.signOut();
      return false;
    }
    let loginTime = dayjs(localStorage.getItem(this.globalService.getParamLoginTime()));
    let sessionTime: number =
      +localStorage.getItem(this.globalService.getParamExpirationTime()) - 60;

    let expiredTime = loginTime.add(sessionTime, 'second');

    if (expiredTime < currentDate) {
      this.signOut();
    }
    return expiredTime >= currentDate;
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Token tidak berlaku Lagi',
      message: 'Mohon Masuk kembali.',
      buttons: ['OK'],
    });

    await alert.present();
    this.signOut();
  }

  async signOut() {
    this.changeIsInitialLogin(false);
    this.storage.set(TOKEN_KEY, null);
    this.authState.next(null);
    localStorage.removeItem(this.globalService.getTokenName());
    localStorage.removeItem(this.globalService.getParamLoginTime());
    this.token = null;
    // localStorage.removeItem(this)
    this.router.navigate(['auth/login']);
    this.globalService.setProfileLoadStatus(false);
    this.globalService.setLevelLoadStatus(false);
  }

  changeIsInitialLogin(state: boolean) {
    this.isInitialLogin = state;
  }

  checkCompleteProfile() {
    this.storage.get(TOKEN_KEY).then((data) => {
      if ((data && data.user.job_title == null) || data.user.job_title == ' ') {
        this.router.navigate(['getting-started']);
      }
    });
  }
}
