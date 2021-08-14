import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { UserProfileModel } from '../../user/profile/user-profile.model';
import { ConnectionService } from '../connection.service';

@Component({
  selector: 'app-incoming-connection-detail',
  templateUrl: './incoming-connection-detail.page.html',
  styleUrls: ['../connection-details.page.scss'],
})
export class IncomingConnectionDetailPage implements OnInit {
  profile: UserProfileModel;
  user_id: any;
  skills: any;
  profileImg = './assets/sample-images/user/default-profile.svg';

  constructor(
    private _route:ActivatedRoute, 
    private navCtrl:NavController,
    private connectionServices:ConnectionService,
    private alertController:AlertController,
    private connectionService:ConnectionService
    ) { 
      
    }

    ngOnInit(){
      this._route.paramMap.subscribe(params => {
        this.user_id = params.get('user_id');
      });
      this.getDetails();
    }

    getDetails(){
      this.connectionServices.getConnectedDetails(this.user_id).subscribe((data: any) => {
        this.profile = data;
        if (this.profile.skill_text != '') {
          this.skills = this.profile.skill_text.split(',');
        } else {
          this.skills = [];
        }
      });
    }

    acceptRequestConnection(source_id){
    let postData = {from:source_id}
    this.connectionService.postAcceptConnection(postData).pipe().subscribe(() => {
      (err) => {
        let message = '';
        if (err.error.message === undefined) {
          message = 'Network Problem, Please Try Again.';
        } else {
          message = err.error.message;
          console.log(message);
        }
      }
    });
    this.profile.is_friend = true;
  }
  declineRequestConnection(id){
    let postData = {who:id}
    this.connectionService.postRejectConnection(postData).pipe().subscribe(() => {
      (err) => {
        let message = '';
        if (err.error.message === undefined) {
          message = 'Network Problem, Please Try Again.';
        } else {
          message = err.error.message;
          console.log(message);
        }
      }
    });
  }
  async decline(id) {
    const alert = await this.alertController.create({
      header: '',
      message: 'Tolak Pertemanan?',
      buttons: [
        {
          text: 'Batalkan',
          role: 'cancel',
        },
        {
          text: 'Ya',
          handler: (blah) => {
            this.declineRequestConnection(id);
            this.navCtrl.navigateBack(['app/connection']);
          },
        },
      ],
    });

    await alert.present();
  }

    unconnectConnection(){
      let postData = {who:this.user_id};
      this.connectionServices.postUnconnectConnection(postData).pipe().subscribe(() => {
        (err) => {
          let message = '';
          if (err.error.message === undefined) {
            message = 'Network Problem, Please Try Again.';
          } else {
            message = err.error.message;
            console.log(message);
          }
        }
      });
      this.profile.is_friend = false;
      this.profile.requested = false;
    }

    onBackClick() {
      this.navCtrl.navigateBack(['app/connection']);
    }

    async unconnect() {
      const alert = await this.alertController.create({
        header: '',
        message: 'Hapus Pertemanan?',
        buttons: [
          {
            text: 'Batalkan',
            role: 'cancel',
          },
          {
            text: 'Ya',
            handler: (blah) => {
              this.unconnectConnection();
              this.onBackClick();
            },
          },
        ],
      });
  
      await alert.present();
    }

}
