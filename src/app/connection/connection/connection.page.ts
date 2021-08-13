import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { ConnectionService } from '../connection.service';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.page.html',
  styleUrls: ['./connection.page.scss'],
})
export class ConnectionPage implements OnInit {
  connected= [];
  requests= [];
  requested= [];
  searched= [];
  noSearch = true;
  wait = false;
  page = 1;
  last_page = 0;
  toggleState = 0;
  size = 0;
  screenWidth: number;
  constructor(
    private navCtrl:NavController,
    private connectionService:ConnectionService,
    private auth: AuthenticationService,
  ) { this.getConnected(), this.getRequestList(), this.getRequestedList(), this.getScreenSize() }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
        this.screenWidth = window.innerWidth;
        if(this.screenWidth <= 359){
          this.size = 12;
        }else if(this.screenWidth < 500){
          this.size = 6;
        }else{
          this.size = 4;
        }
  }

  ngOnInit() {

  }

  ionViewWillEnter(){
    this.doRefresh();
    if (this.auth.token) {
      this.auth.checkExpiredToken();
    }
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
  async searchWait(){
    await this.delay(100);
    if(this.searched.length > 0){
      this.wait = false;
    }else{
      this.wait = false;
    }
    await this.delay(3000);
    if(this.searched.length == 0){
      this.wait = true;
    }
  }

  handleToggle(index: number) {
    this.toggleState = index;
  }

  searchList(ev: any): void {
    const searchValue: string = ev.detail.value;

    if (searchValue.length >= 3) {
      this.searched = [];
      this.searchConnected(searchValue);
      this.noSearch = false;
      this.searchWait();
    } else if (searchValue.length <= 0) {
      this.searched = [];
      this.noSearch = true;
      this.wait = false;
    }
  }
  searchConnected(like: any){
    this.connectionService.searchConnected(like).subscribe((data: any) => {
      this.searched = this.searched.concat(data['data']);
    });
  }
  

  doRefresh(event?:any){
    this.page = 1;
    this.connectionService.getRequestList().subscribe((data:any) => {
      this.requests = data['data'];
    });
    this.connectionService.getRequestedList().subscribe((data:any)=>{
      this.requested = data['data'];
    });
    this.connectionService.getConnected(this.page).subscribe((data: any) => {
      this.connected = [];
      this.connected = this.connected.concat(data['data']);
      if(this.connected.length % 10 != 0){
        this.last_page = Math.round(this.connected.length / 10) + 1;
      }
      if(event){
        event.target.complete();
      }
    });
  }
  getConnected(event?){
    this.connectionService.getConnected(this.page).subscribe((data: any) => {
      this.connected = this.connected.concat(data['data']);
      if(this.connected.length % 10 != 0){
        this.last_page = Math.round(this.connected.length / 10) + 1;
      }
      if(event){
        event.target.complete();
      }
    });
  }
  loadConnectionConnected(event){
    this.page += 1;
    if(this.page-1 === this.last_page){
      // console.log(this.page, this.last_page);
      event.target.disabled = true;
    }else{
      this.getConnected(event);
    }
  }
  getRequestList(){
    this.connectionService.getRequestList().subscribe((data:any) => {
      this.requests = this.requests.concat(data['data']);
    });
  }
  getRequestedList(){
    this.connectionService.getRequestedList().subscribe((data:any)=>{
      this.requested = this.requests.concat(data['data']);
    });
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
    this.requested[index].requested = true;
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
    this.requested[index].requested = false;
  }
  onBackClick() {
    this.navCtrl.navigateBack(['app/home']);
  }

}
