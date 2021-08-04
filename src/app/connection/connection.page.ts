import { Component, OnInit } from '@angular/core';
import { ConnectionService } from './connection.service';
import { NavController} from '@ionic/angular';


@Component({
  selector: 'app-connection',
  templateUrl: './connection.page.html',
  styleUrls: ['./connection.page.scss'],
})
export class ConnectionPage implements OnInit {
  connected= [];
  page = 1;
  last_page = 0;
  toggleState = 0;
  constructor(
    private navCtrl:NavController,
    private connectionService:ConnectionService,

  ) { this.getConnected() }

  ngOnInit() {
  }

  handleToggle(index: number) {
    this.toggleState = index;
  }

  doRefresh(event?:any){
    this.page = 1;
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
  getConnected(event?){
    this.connectionService.getConnected(this.page).subscribe((data: any) => {
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
  loadConnectionConnected(event){
    this.page += 1;
    // if(this.page-1 === this.last_page){
    //   // console.log(this.page, this.last_page);
    //   event.target.disabled = true;
    // }else{
    this.getConnected(event);
    // }
  }
  
  onBackClick() {
    this.navCtrl.navigateForward(['app/connection']);
  }


}
