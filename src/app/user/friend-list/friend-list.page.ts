import { Component, OnInit } from '@angular/core';
import { FriendListModel } from './friend-list.model';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController, LoadingController, AlertController, ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../services/global.service';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { Network } from '@ionic-native/network/ngx';
import { FriendListService } from './friend-list.service';
import { Observable } from 'rxjs';
import { DataStore } from '../../shell/data-store';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Storage } from '@ionic/storage';
import { ZoomImageModalComponent } from '../../modal/zoom-image-modal/zoom-image-modal.component';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.page.html',
  styleUrls: [
    './styles/friend-list.page.scss',
    './styles/friend-list.shell.scss'
  ],
})
export class FriendListPage implements OnInit {

  friendList : FriendListModel;
  connectSubscription : any;

  user_id: String;
  profileImg: string = "./assets/sample-images/user/default-profile.svg";
  modalController: ModalController;
  data = []

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private http: HttpClient,
    private globalService: GlobalService,
    private auth: AuthenticationService,
    private toast: ToastController,
    private loading: LoadingController,
    private alertCtrl: AlertController,
    private network: Network,
    private friendListService: FriendListService,
    private storage: Storage
  ) {
    // this.getUserId();
   }

  getUserId(){
    return this.storage.get('userId').then((user_id)=>{
      this.user_id = user_id;
      //console.log("userId " + this.user_id);
    });
  }

  store(item){
    // this.storage.set(this.friendList.data, '');
    
  }

  onClick(id){
    this.ionViewDidLeave();
    this.navCtrl.navigateRoot('/profile/'+id);
  }

  ngOnInit() {
    this.route.data.subscribe((resolvedRouteData) => {
      const friendListDataStore = resolvedRouteData['data'];
      friendListDataStore.state.subscribe(
        (state) => {
          this.friendList = state;
          this.sort();
          //console.log(this.friendList);
        },
        (error) => { }
        );
      },
      (error) => { });
    }
    
    ionViewWillEnter(): void {
      this.connectSubscription = this.network.onConnect().subscribe(() => {
        const dataSource: Observable<FriendListModel> = this.friendListService.getDataSource();
        const dataStore: DataStore<FriendListModel> = this.friendListService.getDataStore(dataSource);
        dataStore.state.subscribe(
          (state) => {
            this.friendList = state;
        },
        (error) => {}
      );
    })
  }

  ionViewDidLeave(){
    this.connectSubscription.unsubscribe();
  }

  sort(){
    // this.friendList.data.sort((a,b) =>{
    //   if(a.fullname < b.fullname){
    //     console.log("<")
    //     console.log(a.fullname + a.user_id)
    //     console.log(b.fullname + b.user_id)
    //     return -1;
    //   }
    //   if(a.fullname > b.fullname){
    //     console.log(">")
    //     console.log(a.fullname + a.user_id)
    //     console.log(b.fullname + b.user_id)
    //     return 1;
    //   }
    //   return 0;
    //   }
    // );
    this.friendList.data = this.friendList.data.sort((a,b) =>
    a.fullname.localeCompare(b.fullname))
  }
  
  separator(record, recordIndex, records){
    if(recordIndex == 0){
      return record.fullname[0].toUpperCase();
    }

    let first_prev = records[recordIndex-1].fullname[0];
    let first_current = record.fullname[0];

    if(first_prev != first_current){
      return first_current.toUpperCase();
    }
    return null;
  }

  async zoomImage(pic){
    let image = this.profileImg;
    if(pic){
      image = pic
    }
    const modal = await this.modalController.create({
      component: ZoomImageModalComponent,
      componentProps: {
        imageUrl: image
      },
      cssClass: 'zoom-image-modal-class',
    })
    await modal.present();
  }

  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

}
