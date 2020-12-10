import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationResponse } from '../core/models/notification/NotificationResponse';
import { ShellModel } from '../shell/data-store';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GlobalService } from '../services/global.service';
import { AuthenticationService } from '../services/auth/authentication.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: [
    './styles/notifications.page.scss',
    './styles/notifications.shell.scss'
  ]
})
export class NotificationsPage implements OnInit {
  notifications: any;

  constructor(
    private _route: ActivatedRoute,
    private _pipe: DatePipe,
    private _navCtrl: NavController,
    private _router: Router,
    private _globalService: GlobalService,
    private _auth: AuthenticationService,
    private _http: HttpClient,
    private loadingCtrl: LoadingController,
    private toast: ToastController
  ) {
  }

  notif: NotificationResponse & ShellModel;
  notifData: any;
  notifToday: any;
  countData: any = 0;
  start: any = 1;
  pastNotif: any = [];
  response: any;


  destroySubscription = new Subject<any>();

  ngOnInit(): void {
    // if (this.route && this.route.data) {
    //   this.route.data.subscribe(resolvedData => {
    //     const dataSource = resolvedData['data'];
    //     if (dataSource) {
    //       dataSource.source.subscribe(pageData => {
    //         if (pageData) {
    //           this.notifications = pageData;
    //         }
    //       });
    //     }
    //   });
    // }
  }

  ionViewWillLeave() {
    this.destroySubscription.next();
  }

  ionViewWillEnter() {
    this.pastNotif = [];
    this.fetchData();
  }

  fetchData() {
    this.loadingCtrl.create()
      .then((loadingEl) => {
        loadingEl.present();
        this._route.data
          .pipe(takeUntil(this.destroySubscription))
          .subscribe((resolvedState) => {
            resolvedState.data.state.subscribe(
              (notifResponse) => {
                this.notif = notifResponse;
                console.log(this.notif);
                this.filterData();
                this.grouping();
                if (!this.notif.isShell) {
                  loadingEl.dismiss();
                }
              },
              (err) => {
                console.log(err);
              }
            );
          });
      });
  }

  filterData() {
    this.notifToday = this.notif.data.filter((data) => {
      if (data.date_convert === false) {
        return data;
      }
    });
    this.notifData = this.notif.data.filter((data) => {
      if (data.date_convert === true) {
        return data;
      }
    });
    this.countData = this.notifData.length + this.notifToday.length;
    console.log('ini data');
    console.log(this.notifToday);
    console.log(this.notifData);
    console.log(this.countData);
  }

  loadData(event) {
    setTimeout(() => {
      console.log(this.start);

      let url = this._globalService.getApiUrl() + 'api/notif?X-Api-Key=' + this._globalService.getGlobalApiKey() + '&start=' + this.start + '&X-Token=' + this._auth.token;

      this._http.get(url).pipe()
        .subscribe(res => {
          console.log(res);
          this.response = res;

          this.start += 1;
          console.log(this.start);
          this.response.data.filter((data) => {
            if (data.date_convert === false) {
              this.notifToday.push(data);
            }
            if (data.date_convert === true) {
              this.notifData.push(data);
            }
          });
          this.countData = this.notifToday.length + this.notifData.length;
          console.log(this.countData);
          this.grouping();
          event.target.complete();

          if (this.countData == this.response.totalLength) {
            this.presentToast('Kamu telah mencapai akhir.');
            event.target.disabled = true;
          }
        }, err => {
          console.log(err);
        });
    }, 800);

  }

  grouping() {
    this.notifData.forEach(e => {
      const date = moment(e.date_past);
      const dateKey = date.format('MMM DD');
      const find = this.pastNotif.findIndex(n => n.key === dateKey);

      if (find < 0) {
        this.pastNotif.push({ key: dateKey, value: [e] });
      } else {
        this.pastNotif[find].value.push(e);
      }
    });


    console.log('ini grouping');
    console.log(this.pastNotif);
  }

  getDate(dateString: string) {
    return moment(dateString, 'YYYY-MM-DD').toDate();
  }

  goBack() {
    this._navCtrl.navigateBack(['/app/home']);
  }

  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();

  }

  goTo(type_id: string, detail_id: string, id: string) {
    let url = this._globalService.getApiUrl() + 'api/notif?X-Api-Key=' + this._globalService.getGlobalApiKey() + '&X-Token=' + this._auth.token;

    const options = {
      notif_id: id
    };

    this._http.put(url, options).pipe()
      .subscribe(data => {
        // this.presentToast(data["message"]);
        console.log(type_id);
        console.log(detail_id);
        console.log(id);
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

    if (type_id == '1') {
      this._router.navigate(['app/events', detail_id]);
    }
    if (type_id == '2') {
      this._router.navigate(['/app/events/challenges/challenge-detail', detail_id]);
    }
    if (type_id == '4') {
      this._router.navigate(['/app/jobs/job-detail', detail_id]);
    }
    if (type_id == '5') {
      this._router.navigate(['/app/user']);
    }
  }

}
