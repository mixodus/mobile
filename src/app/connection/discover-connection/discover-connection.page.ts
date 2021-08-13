import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ConnectionService } from '../connection.service';

@Component({
  selector: 'app-discover-connection',
  templateUrl: './discover-connection.page.html',
  styleUrls: ['../connection/connection.page.scss'],
})
export class DiscoverConnectionPage implements OnInit {
  connection = [];
  searched = [];
  noSearch= true;
  wait= false;
  public token = '';
  public page = 1;
  public last_page = 0;

  constructor(
    private navCtrl:NavController,
    private connectionService: ConnectionService,
  ) {this.getConnectionDiscover()}

  ngOnInit() {

  }

  onBackClick() {
    this.navCtrl.navigateBack(['app/connection']);
  }

  ionViewWillEnter(){
    this.doRefresh();
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

  searchList(ev: any): void {
    const searchValue: string = ev.detail.value;

    if (searchValue.length >= 3) {
      this.searched = [];
      this.searchConnection(searchValue);
      this.noSearch = false;
      this.searchWait();
    } else if (searchValue.length <= 0) {
      this.searched = [];
      this.noSearch = true;
      this.wait = false;
    }
  }

  searchConnection(like: any){
    this.connectionService.discoverSearch(like).subscribe((data: any) => {
      this.searched = this.searched.concat(data['data']);
    });
  }

  doRefresh(event?:any){
    this.page = 1;
    this.connectionService.getConnection(this.page).subscribe((data: any) => {
      this.connection = [];
      this.connection = this.connection.concat(data['data']);
      if(this.connection.length % 10 != 0){
        this.last_page = Math.round(this.connection.length / 10) + 1;
      }
      if(event){
        event.target.complete();
      }
    });
  }

  getConnectionDiscover(event?){
    this.connectionService.getConnection(this.page).subscribe((data: any) => {
      this.connection = this.connection.concat(data['data']);
      if(this.connection.length % 10 != 0){
        this.last_page = Math.round(this.connection.length / 10) + 1;
      }
      if(event){
        event.target.complete();
      }
    });
  }

  loadConnectionDiscover(event){
    this.page += 1;
    if(this.page-1 === this.last_page){
      // console.log(this.page, this.last_page);
      event.target.disabled = true;
    }else{
    this.getConnectionDiscover(event);
    }
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
    if(this.noSearch){
      this.connection[index].requested = true;
    }else{
      this.searched[index].requested = true;
    }
    
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
    if(this.noSearch){
      this.connection[index].requested = false;
    }else{
      this.searched[index].requested = false;
    }
  }

}
