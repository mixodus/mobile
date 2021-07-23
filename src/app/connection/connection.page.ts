import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '../services/auth/authentication.service';
import { GlobalService } from '../services/global.service';
import { HomeService } from '../home/home.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { NavController, ToastController, Platform, IonRefresher, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.page.html',
  styleUrls: ['./connection.page.scss'],
})
export class ConnectionPage implements OnInit {
  connection = [];
  public token = '';
  public page = 1;
  public last_page = 0;
  toggleState = 0;
  constructor(
    private navCtrl:NavController,
    private http: HttpClient,
    private globalService: GlobalService,
    private auth: AuthenticationService,
    private homeService: HomeService,
  ) { this.getConnection() }

  ngOnInit() {
    
  }

  handleToggle(index: number) {
    this.toggleState = index;
  }

  onBackClick() {
    this.navCtrl.navigateForward(['app/home']);
  }

  getConnection(event?){
    this.homeService.getConnection(this.page).subscribe((data: any) => {
      this.connection = this.connection.concat(data['data']);
      if(this.connection.length % 5 != 0){
        this.last_page = Math.round(this.connection.length / 5) + 1;
        console.log(this.last_page);
      }
      if(event){
        event.target.complete();
      }
      console.log(this.connection);
    });
  }

  loadConnectionData(event){
    this.page += 1;
    if(this.page-1 === this.last_page){
      // console.log(this.page, this.last_page);
      event.target.disabled = true;
    }else{
      this.getConnection(event);
    }
  }

}
