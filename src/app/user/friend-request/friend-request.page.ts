import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  NavController,
  LoadingController,
  ToastController,
  AlertController,
  ModalController,
} from '@ionic/angular';
import { GlobalService } from '../../services/global.service';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { FriendRequestModel } from './friend-request.model';
import { FriendRequestService } from './friend-request.service';
import { Network } from '@ionic-native/network/ngx';
import { Observable } from 'rxjs';
import { DataStore } from '../../shell/data-store';
import { ZoomImageModalComponent } from '../../modal/zoom-image-modal/zoom-image-modal.component';

@Component({
  selector: 'app-friend-request',
  templateUrl: './friend-request.page.html',
  styleUrls: [
    './styles/friend-request.page.scss',
    './styles/friend-request.shell.scss',
    './styles/friend-request.ios.scss',
    './styles/friend-request.md.scss',
  ],
})
export class FriendRequestPage implements OnInit {
  friendRequest: FriendRequestModel;
  connectSubscription: any;

  user_id: any;

  profileImg = './assets/sample-images/user/default-profile.svg';
  modalController: ModalController;

  separator: any;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private http: HttpClient,
    private globalService: GlobalService,
    private auth: AuthenticationService,
    private toast: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private network: Network,
    private friendRequestService: FriendRequestService,
    private storage: Storage
  ) {
    this.getUserId();
  }

  @HostBinding('class.is-shell') get isShell() {
    return this.friendRequest && this.friendRequest.isShell ? true : false;
  }

  getUserId() {
    return this.storage.get('userId').then((user_id) => {
      this.user_id = user_id;
      console.log('userId ' + this.user_id);
    });
  }

  ngOnInit(): void {
    this.route.data.subscribe(
      (resolvedRouteData) => {
        const friendRequestDataStore = resolvedRouteData['data'];
        friendRequestDataStore.state.subscribe(
          (state) => {
            this.friendRequest = state;
          },
          (error) => {}
        );
      },
      (error) => {}
    );
  }

  ionViewWillEnter(): void {
    this.connectSubscription = this.network.onConnect().subscribe(() => {
      const dataSource: Observable<FriendRequestModel> = this.friendRequestService.getDataSource();
      const dataStore: DataStore<FriendRequestModel> = this.friendRequestService.getDataStore(
        dataSource
      );
      dataStore.state.subscribe(
        (state) => {
          this.friendRequest = state;
        },
        (error) => {}
      );
    });
  }

  ionViewDidLeave() {
    this.connectSubscription.unsubscribe();
  }

  async approve(id) {
    // console.log(this.friendRequest.data.find(x => x.user_id === id))
    console.log(id);
    const loading = await this.loadingCtrl.create();
    await loading.present();

    const headers = new HttpHeaders({
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': `${this.auth.token}`
    });

    const body = {id: id};

    const options = { headers: headers, body: body };

    const approveFriendEndpoint =
      this.globalService.apiUrl +
      'friend/approve?from=' + id;

    this.http
      .post(approveFriendEndpoint, options)
      .pipe(finalize(() => this.loadingCtrl.dismiss()))
      .subscribe(
        (data) => {
          this.presentToast(data['message']);
          this.globalService.refreshFlag.profile = true;
          this.globalService.refreshFlag.level = true;
        },
        (err) => {
          let message = '';
          if (err.error.message === undefined) { message = 'Network problem, please try again !'; }
          else { message = err.error.message; }

          this.presentToast(message);
        }
      );
  }

  onClick(id) {
    this.ionViewDidLeave();
    this.navCtrl.navigateRoot('/profile/' + id);
  }

  async reject(id) {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    const token = this.auth.token;

    const url =
      this.globalService.getApiUrl() +
      'friend/reject?X-Api-Key=' +
      this.globalService.getGlobalApiKey() +
      '&X-Token=' +
      token;

    const data: any = {
      // me : this.user_id,
      who: id,
    };

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    this.http
      .post(url, data)
      .pipe(finalize(() => this.loadingCtrl.dismiss()))
      .subscribe(
        (data) => {
          this.presentToast(data['message']);
          this.globalService.refreshFlag.profile = true;
          this.globalService.refreshFlag.level = true;
        },
        (err) => {
          let message = '';
          if (err.error.message === undefined) { message = 'Network problem, please try again !'; }
          else { message = err.error.message; }

          this.presentToast(message);
        }
      );
  }

  async zoomImage(pic) {
    let image = this.profileImg;
    if (pic) {
      image = pic;
    }
    const modal = await this.modalController.create({
      component: ZoomImageModalComponent,
      componentProps: {
        imageUrl: image,
      },
      cssClass: 'zoom-image-modal-class',
    });
    await modal.present();
  }

  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }
}
