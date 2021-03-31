import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { NavController, IonRefresher } from '@ionic/angular';
import { EventsService } from '../../services/events.service';
import { ShellModel } from '../../../../shell/data-store';
import { EventsResponse } from '../../../../core/models/event/EventResponse';
import * as moment from 'moment';
import { EventType } from '../../../../core/constants/event-type.enum';
import { Location } from '@angular/common';

@Component({
  selector: 'app-events-list-by-category',
  templateUrl: './events-list-by-category.page.html',
  styleUrls: ['./events-list-by-category.page.scss'],
})
export class EventsListByCategoryPage implements OnInit {
  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _navCtrl: NavController,
    private _eventService: EventsService,
    private location: Location
  ) {}

  categoryName: string = 'Events By Category';
  eventType: string = '1';
  events: EventsResponse & ShellModel;
  refresher: IonRefresher;
  onGoing: any;
  upComing: any;
  countOnGoing: any = 0;
  countUpComing: any = 0;

  ngOnInit() { }

  get dummyImage1() {
    return 'assets/new-assets/sample-image/drawable-hdpi/banner.png';
  }

  get dummyImage2() {
    return 'assets/new-assets/sample-image/drawable-hdpi/banner-2.png';
  }

  ionViewWillEnter() {
    // this.refresher.disabled = false;

    this._route.paramMap
      .pipe(
        switchMap((param) => {
          if (param.has('event_type')) {
            this.eventType = param.get('event_type');
            if(this.eventType == '1'){
              this.categoryName = "Acara";
            }
            if(this.eventType == '2'){
              this.categoryName = "Bootcamp";
            }
          }

          return of(param);
        })
      )
      .subscribe();
      
    this.fetchData();

  }
  
  // ionViewWillLeave() {
  //   this.refresher.disabled = true;
  // }
  
  fetchData() {
    this._route.data.subscribe((resolvedState) => {
      resolvedState.data.state.subscribe(
        (eventsResponse) => {
          this.events = eventsResponse;
          //console.log(this.events);
          this.filterData();
        },
        (err) => {
          //console.log(err);
        }
      );
    });
  }

  filterData(){
    if(this.events.data){
      //console.log('this.event.data: ', this.events.data);

      this.onGoing = this.events.data.filter((data) => {
        return data.event_ongoing;
      });
      this.upComing = this.events.data.filter((data) => {
        return !data.event_ongoing;
      });
      this.countOnGoing = this.onGoing.length;
      this.countUpComing = this.upComing.length;
    }
      //console.log(this.countOnGoing);
      //console.log(this.countUpComing);
  }

  doRefresh(event: any) {
    this.events.isShell = true;

    const eventDataStore = this._eventService.getListTypeDataStore(this.eventType, true);
   
    eventDataStore.state.subscribe(
      (state) => {
        this.events = state;
      },
      (error) => {}
    );
    event.target.complete();
  }

  goToEventDetail(detailId: string, typeId: string) {
    //console.log({ detailId, typeId });

    if (+typeId === EventType.Event || +typeId === EventType.Bootcamp) {
      this._router.navigate(['app/events', detailId]);
    }
  }

  getEventImage(filename: string) {
    return this._eventService.getEventImage(filename);
  }

  getEventDate(dateString: string) {
    return moment(dateString, 'YYYY-MM-DD').toDate();
  }

  goBack() {
    this.location.back();
    // this._navCtrl.navigateBack(['app/events']);
  }
}
