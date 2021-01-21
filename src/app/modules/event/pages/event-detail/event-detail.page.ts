import { Component, OnInit, HostBinding, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../../services/global.service';
import { EventDetailResolver } from './event-detail.resolver';
import {
  LoadingController,
  NavController,
  ToastController,
  AlertController,
  IonRefresher,
} from '@ionic/angular';
import { AuthenticationService } from '../../../../services/auth/authentication.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventsResponse } from '../../../../core/models/event/EventResponse';
import { EventsService } from '../../services/events.service';
import * as moment from 'moment';
import { EventType } from '../../../../core/constants/event-type.enum';
import { ShellModel } from '../../../../../app/shell/data-store';
import { EventsListPage } from '../events-list/events-list.page';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Location } from '@angular/common';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./styles/event-detail.page.scss', './styles/event-detail.shell.scss'],
  // template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class EventDetailPage implements OnInit {
  public rootPage: any = EventsListPage;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _eventService: EventsService,
    private loadingCtrl: LoadingController,
    private globalService: GlobalService,
    private navCtrl: NavController,
    private toast: ToastController,
    private alertCtrl: AlertController,
    private auth: AuthenticationService,
    private _zone: NgZone,
    private location: Location
  ) {}

  destroySubscription = new Subject<any>();


  eventDetail: EventsResponse & ShellModel;
  details: EventDetailResolver;
  default_place: string = 'Idstar';

  @HostBinding('class.is-shell') get isShell() {
    // return (this.details && this.details.isShell) ? true : false;
    return false;
  }

  @ViewChild('htmlDiv', { static: true }) simple;

  @ViewChild(IonRefresher, { static: false })
  refresher: IonRefresher;

  ngOnInit(): void {}

  ionViewWillEnter() {
    // this.refresher.disabled = false;

    this.fetchData();
  }

  ionViewWillLeave() {
    // this.refresher.disabled = true;
    this.destroySubscription.next();
  }

  fetchData() {
    this._route.data.subscribe((resolvedData) => {
      resolvedData.data.state.pipe(takeUntil(this.destroySubscription)).subscribe(
        (eventResponse) => {
          this.eventDetail = eventResponse;
          console.log(this.eventDetail);
        },
        (err) => {
          console.log(err);
        }
      );
    });
  }

  getImage() {
    try {
      if (this.eventDetail) {
        return this._eventService.getEventImage(this.eventDetail.data[0].event_banner);
      } else {
        return '';
      }
    } catch {
      return '';
    }
  }

  getDate(stringDate: string) {
    try {
      if (stringDate) {
        return moment(stringDate, 'YYYY-MM-dd').toDate();
      } else {
        return new Date();
      }
    } catch {
      return new Date();
    }
  }

  getEventType(eventType: string) {
    switch (+eventType) {
      case EventType.Event:
        return 'Event';
      case EventType.Bootcamp:
        return 'Bootcamp';
      case EventType.Challenge:
        return 'Challenge';
      default:
        return 'Event';
    }
  }

  async confirm() {
    // const alert = await this.alertCtrl.create({
    //   header: 'Confirm',
    //   message: 'Are you sure want to join this event?',
    //   buttons: [
    //     {
    //       text: 'No',
    //       role: 'cancel',
    //     },
    //     {
    //       text: 'Yes',
    //       handler: () => {
    //         const id = this.eventDetail.data[0].event_id;

    //         this._zone.run(async () => {
    //           await this.navCtrl.navigateForward(['app/events/register', id]);
    //         });
    //       },
    //     },
    //   ],
    // });

    // await alert.present();

    const id = this.eventDetail.data[0].event_id;
    this.navCtrl.navigateForward(['app/events/register', id]);
  }

  async join() {
    // let loading = await this.loadingCtrl.create();
    // await loading.present();
    // let dataPass = {
    //   event_id: this.details.event_id,
    // };
    // let token = this.auth.token;
    // let url =
    //   this.globalService.getApiUrl() +
    //   'api/event/join?X-Api-Key=' +
    //   this.globalService.getGlobalApiKey() +
    //   '&X-Token=' +
    //   token;
    // var headers = new HttpHeaders();
    // headers.append('Access-Control-Allow-Origin', '*');
    // headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    // headers.append('Accept', 'application/json');
    // headers.append('Content-Type', 'application/x-www-form-urlencoded');
    // headers.append('Access-Control-Allow-Credentials', 'true');
    // headers.append(
    //   'Access-Control-Allow-Headers',
    //   'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
    // );
    // this.http
    //   .post(url, dataPass, { headers: headers })
    //   .pipe(finalize(() => this.loadingCtrl.dismiss()))
    //   .subscribe(
    //     (data) => {
    //       this.presentToast(data['message']);
    //       this.globalService.refreshFlag.home = true;
    //       this.globalService.refreshFlag.jobApp = true;
    //       this.navCtrl.back();
    //     },
    //     (err) => {
    //       let message = '';
    //       if (err.error.message === undefined) message = 'Permasalahan jaringan, mohon coba lagi.';
    //       else message = err.error.message;
    //       this.presentToast(message);
    //     }
    //   );
  }

  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }

  goBack() {
    this.location.back();
    // this.navCtrl.navigateForward(['app/events']);
  }
}
