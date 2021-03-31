import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { HistoryService } from '../../history.service';
import { ShellModel } from '../../../../../shell/data-store';
import { EventHistoryResponse } from '../../HistoryResponse';
import * as moment from 'moment';
import { IEvent } from '../../../../../core/models/event/IEvent';
@Component({
  selector: 'app-bootcamp',
  templateUrl: './bootcamp.component.html',
  styleUrls: ['./bootcamp.component.scss'],
})
export class BootcampComponent implements OnInit {
  data: IEvent[];
  countData: number;
  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _navCtrl: NavController,
    private _historyService: HistoryService) { }


  events: EventHistoryResponse & ShellModel;

  get dummyImage1() {
    return 'assets/new-assets/sample-image/drawable-hdpi/banner.png';
  }

  get dummyImage2() {
    return 'assets/new-assets/sample-image/drawable-hdpi/banner-2.png';
  }

  get emptyImage() {
    return 'assets/new-assets/empty-event.png';
  }
  ionViewWillEnter() {
    this.fetchData();
  }

  fetchData() {
    this._route.data.subscribe((resolvedState) => {
      resolvedState.event.state.subscribe(
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

  filterData() {
    this.data = this.events.data.filter((data) => {
      return data;
    });
    this.countData = this.data.length;
    //console.log(this.countData);
  }

  goToEventDetail(detailId: string, typeId: string) {
    //console.log({ detailId, typeId });

    this._router.navigate(['app/events', detailId]);
  }

  getEventImage(filename: string) {
    return this._historyService.getEventImage(filename);
  }

  getEventDate(dateString: string) {
    return moment(dateString, 'YYYY-MM-DD').toDate();
  }
  ngOnInit() { }
}
