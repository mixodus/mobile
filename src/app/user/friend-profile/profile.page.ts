import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FriendProfileModel } from './profile.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController, Platform, LoadingController, ToastController } from '@ionic/angular';
import { ZoomImageModalComponent } from '../../modal/zoom-image-modal/zoom-image-modal.component';
import { GlobalService } from '../../services/global.service';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { Location } from '@angular/common';

@Component({
  selector: 'app-contact-card',
  templateUrl: './profile.page.html',
  styleUrls: [
    './styles/profile.page.scss',
    './styles/profile.shell.scss'
  ]
})
export class ProfilePage implements OnInit {

  // user_id: any;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private modalController: ModalController,
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private auth: AuthenticationService,
    private globalService: GlobalService,
    private http: HttpClient,
    private toast: ToastController,
    private storage: Storage,
    private location: Location
  ) {

    this.getData();
    // this.getUserId();
  }

  private checked = false;
  private specificChecked = false;
  activeButton: any;
  experienceImage = './assets/images/building.png';
  educationImg = './assets/images/graduation-hat.png';
  projectImg = './assets/images/project.png';
  friendProfile: FriendProfileModel;
  profile: any;
  segmentValue = 'experience';
  subscribe: any;
  profileImg = './assets/sample-images/user/default-profile.svg';
  @ViewChild('readMoreBtn', { static: false }) readMoreBtn: ElementRef;
  @ViewChild('moreText', { static: false }) moreText: ElementRef;

  buttonAdd = 'aaaa';
  click: number;

  name = 'Angular 6';
  users: Array<any> = [{
    id: 1,
    name: 'User 1',
    active: false
  }, {
    id: 2,
    name: 'User 2',
    active: true
  }, {
    id: 3,
    name: 'User 3',
    active: true
  }, {
    id: 4,
    name: 'User 4',
    active: false
  }];

  getData() {
    this.route.data.subscribe((resolvedRouteData) => {
      const friendProfileDataStore = resolvedRouteData['data'];
      friendProfileDataStore.state.subscribe(
        (state) => {
          this.friendProfile = state;
          console.log(this.friendProfile);
        }
      );
    });

  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.subscribe = this.platform.backButton.subscribe(() => {
      this.navCtrl.back();
    });
  }

  ionViewWillLeave() {
    this.subscribe.unsubscribe();
  }

  segmentChanged(ev: any) {
    this.segmentValue = ev.detail.value;
  }

  showMoreOrLess(id) {
    if (this.checked === false) {
      this.activeButton = id;
      this.checked = true;
      this.specificChecked = true;
    } else {
      this.activeButton = id;
      this.checked = false;
      this.specificChecked = false;
    }
  }

  async zoomImage() {
    if (this.friendProfile.profile_picture_url) {
      this.profileImg = this.friendProfile.profile_picture_url;
    }
    const modal = await this.modalController.create({
      component: ZoomImageModalComponent,
      componentProps: {
        imageUrl: this.profileImg
      },
      cssClass: 'zoom-image-modal-class',
    });
    await modal.present();
  }

  async addFriend() {
    // if(this.click==0){
    //   this.click=1;
    //   this.buttonAdd='requested';
    //   console.log(this.click);
    // }
    // else if(this.click==1){
    //   this.buttonAdd='decline';
    //   this.click=2;
    //   console.log(this.click);
    // }
    // else{
    //   this.click=0;
    //   this.buttonAdd='add-friend';
    //   console.log(this.click)
    // }

    const loading = await this.loadingCtrl.create();
    await loading.present();


    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': `${this.auth.token}`
    });

    const body = {};

    const options = { headers: headers };

    const addFriendEndpoint =
      this.globalService.apiUrl +
      'friend/add_friend' + '?to=' + this.friendProfile.user_id;

    this.http.post(addFriendEndpoint, body, options).pipe(
      finalize(() => this.loadingCtrl.dismiss())
    )
      .subscribe(data => {
        console.log('data222: ', data);
        this.presentToast(data['message']);
        this.globalService.refreshFlag.profile = true;
        this.globalService.refreshFlag.level = true;
      }, err => {

        let message = '';
        if (err.error.message === undefined) {
          message = 'Network problem, please try again !';
        } else {
          message = err.error.message;
        }

        console.log('message: ', message);
        this.presentToast(message);
      });
  }

  async unFriend() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    const headers = new HttpHeaders({
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': `${this.auth.token}`
    });

    const body = {};

    const options = { headers: headers };

    const unfriendEndpoint =
      this.globalService.apiUrl +
      'friend/unfriend' + '?who=' + this.friendProfile.user_id;

    this.http.post(unfriendEndpoint, body, options).pipe(
      finalize(() => this.loadingCtrl.dismiss())
    )
      .subscribe(data => {
        this.presentToast(data['message']);
        this.globalService.refreshFlag.profile = true;
        this.globalService.refreshFlag.level = true;
      }, err => {

        let message = '';
        if (err.error.message === undefined) {
          message = 'Network problem, please try again !';
        } else {
          message = err.error.message;
        }

        this.presentToast(message);
      });

  }


  // getUserId(){
  //   return this.storage.get('userId').then((user_id)=>{
  //     this.user_id = user_id;
  //     console.log("userId " + this.user_id);
  //    });
  // }


  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  click2(user) {
    user.active = !user.active;
    // your code here....
  }

  goBack() {
    this.location.back();
  }
}
