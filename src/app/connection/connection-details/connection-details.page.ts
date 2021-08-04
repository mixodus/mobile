import { DeprecatedDecimalPipe } from '@angular/common';
import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { UserProfileModel } from '../../user/profile/user-profile.model';
import { ConnectionService } from '../connection.service';

@Component({
  selector: 'app-connection-details',
  templateUrl: './connection-details.page.html',
  styleUrls: ['./connection-details.page.scss'],
})
export class ConnectionDetailsPage implements OnInit {
  profile: UserProfileModel;
  user_id: any;
  skills: any;
  profileImg = './assets/sample-images/user/default-profile.svg';

  @HostBinding('class.is-shell') get isShell() {
    return this.profile && this.profile.isShell;
  }

  constructor(
    private _route:ActivatedRoute, 
    private navCtrl:NavController,
    private connectionServices:ConnectionService,
    private alertController:AlertController,
    ) { 
      
    }


    ngOnInit(){
      this._route.paramMap.subscribe(params => {
        this.user_id = params.get('user_id');
        console.log(this.user_id);
      });
      this.getConnectedDetails();
    }

    getConnectedDetails(){
      this.connectionServices.getConnectedDetails(this.user_id).subscribe((data: any) => {
        this.profile = data;
        console.log(data);
        if (this.profile.skill_text != '') {
          this.skills = this.profile.skill_text.split(',');
        } else {
          this.skills = [];
        }
      });
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
    }

    onBackClick() {
      this.navCtrl.navigateForward(['app/connection']);
    }

    async unconnect() {
      const alert = await this.alertController.create({
        header: '',
        message: 'Unconnect connection?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
          },
          {
            text: 'Yes',
            handler: (blah) => {
              this.unconnectConnection();
            },
          },
        ],
      });
  
      await alert.present();
    }

}
