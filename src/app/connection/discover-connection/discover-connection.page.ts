import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ConnectionService } from '../connection.service';

@Component({
  selector: 'app-discover-connection',
  templateUrl: './discover-connection.page.html',
  styleUrls: ['../connection.page.scss'],
})
export class DiscoverConnectionPage implements OnInit {
  connected = [];
  connection = [];
  requests = [];
  public token = '';
  public page = 1;
  public last_page = 0;

  constructor(
    private navCtrl:NavController,
    private connectionService: ConnectionService,
  ) { this.getConnected(), this.getConnectionDiscover(); this.getRequestList()}

  ngOnInit() {

  }

  onBackClick() {
    this.navCtrl.navigateForward(['app/connection']);
  }

  ionViewWillEnter(){
    
  }

  doRefresh(event?:any){
    this.page = 1;
    this.connectionService.getRequestList().subscribe((data:any) => {
      this.requests = data['data'];
      console.log(this.requests);
    });
    this.connectionService.getConnection(this.page).subscribe((data: any) => {
      this.connection = [];
      this.connection = this.connection.concat(data['data']);
      if(this.connection.length % 10 != 0){
        this.last_page = Math.round(this.connection.length / 10) + 1;
        console.log(this.last_page);
      }
      if(event){
        event.target.complete();
      }
      console.log(this.connection);
    });
    this.connectionService.getConnected(this.page).subscribe((data: any) => {
      this.connected = [];
      this.connected = this.connected.concat(data['data']);
      if(this.connected.length % 10 != 0){
        this.last_page = Math.round(this.connected.length / 10) + 1;
        console.log(this.last_page);
      }
      if(event){
        event.target.complete();
      }
      console.log(this.connected);
    });
  }

  getConnectionDiscover(event?){
    this.connectionService.getConnection(this.page).subscribe((data: any) => {
      this.connection = this.connection.concat(data['data']);
      if(this.connection.length % 10 != 0){
        this.last_page = Math.round(this.connection.length / 10) + 1;
        console.log(this.last_page);
      }
      if(event){
        event.target.complete();
      }
      console.log(this.connection);
    });
  }
  getConnected(){
    this.connectionService.getConnected(this.page).subscribe((data: any) => {
      this.connected = this.connected.concat(data['data']);
      if(this.connected.length % 10 != 0){
        this.last_page = Math.round(this.connected.length / 10) + 1;
        console.log(this.last_page);
      }
      console.log(this.connected);
    });
  }

  loadConnectionDiscover(event){
    this.page += 1;
    // if(this.page-1 === this.last_page){
    //   // console.log(this.page, this.last_page);
    //   event.target.disabled = true;
    // }else{
    this.getConnectionDiscover(event);
    // }
  }

  getRequestList(){
    this.connectionService.getRequestList().subscribe((data:any) => {
      this.requests = this.requests.concat(data['data']);
      console.log(this.requests);
    });
  }

  requestConnection(target_id, index){
    let postData = {to:target_id}
    this.connectionService.postConnectionRequest(postData).pipe().subscribe(() => {
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
    this.connection[index].requested = true;
  }
  cancelRequestConnection(target_id, index){
    let postData = {to:target_id}
    this.connectionService.cancelPostConnectionRequest(postData).pipe().subscribe(() => {
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
    this.connection[index].requested = false;
  }
  acceptRequestConnection(source_id, index){
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
    this.requests.splice(index, 1);
  }
  declineRequestConnection(source_id, index){
    let postData = {who:source_id}
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
    this.requests.splice(index, 1);
  }

}
