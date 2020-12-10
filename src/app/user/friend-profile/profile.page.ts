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
  private checked: boolean = false;
  private specificChecked: boolean = false;
  activeButton: any;
  experienceImage: string = './assets/images/building.png';
  educationImg: string = './assets/images/graduation-hat.png';
  projectImg: string = './assets/images/project.png';
  friendProfile: FriendProfileModel;
  profile: any;
  segmentValue: string = 'experience';
  subscribe: any;
  profileImg: string = './assets/sample-images/user/default-profile.svg';
  @ViewChild('readMoreBtn', { static: false }) readMoreBtn: ElementRef;
  @ViewChild('moreText', { static: false }) moreText: ElementRef;

  buttonAdd: string = 'aaaa';
  click: number;

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

    let loading = await this.loadingCtrl.create();
    await loading.present();

    let token = this.auth.token;

    let url = this.globalService.getApiUrl() + 'friend/add_friend?X-Api-Key=' + this.globalService.getGlobalApiKey() + '&X-Token=' + token;

    let data: any = {
      // me : this.user_id,
      to: this.friendProfile.user_id
    };

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    this.http.post(url, data).pipe(
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

  async unFriend() {
    let loading = await this.loadingCtrl.create();
    await loading.present();

    let token = this.auth.token;

    let url = this.globalService.getApiUrl() + 'friend/unfriend?X-Api-Key=' + this.globalService.getGlobalApiKey() + '&X-Token=' + token;

    let data: any = {
      // me : this.user_id,
      who: this.friendProfile.user_id
    };

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    this.http.post(url, data).pipe(
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

  click2(user) {
    user.active = !user.active
    // your code here....
  }

  goBack() {
    this.location.back();
  }
}
