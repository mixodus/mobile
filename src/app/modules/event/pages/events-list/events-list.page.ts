import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController, IonRefresher } from '@ionic/angular';
import { EventsService } from '../../services/events.service';
import { EventsResponse, OnGoingEventListResponse } from '../../../../core/models/event/EventResponse';
import { EventType } from '../../../../core/constants/event-type.enum';
import * as moment from 'moment';
import { ShellModel } from '../../../../shell/data-store';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.page.html',
  styleUrls: ['./events-list.page.scss'],
})
export class EventsListPage implements OnInit {
  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _eventService: EventsService,
    private _navCtrl: NavController
  ) {
  }

  destroySubscription = new Subject<any>();

  bannerConfig = {
    slidesPerView: '1.25',
    spaceBetween: 15,
    pagination: {
      el: '.banner-pagination',
      hideOnClick: false,
      clickable: true,
    },
  };

  updatedBannerConfig = {
    initialSlide: 0,
    speed: 500,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    slidesPerView: '1.25',
    loop: true,
    centeredSlides: true,
    spaceBetween: 10
  };

  banners: EventsResponse & ShellModel;
  events: OnGoingEventListResponse & ShellModel;

  @ViewChild(IonRefresher, { static: false })
  refresher: IonRefresher;

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.refresher.disabled = false;

    this.fetchData();
  }

  ionViewWillLeave() {
    this.refresher.disabled = true;
  }

  get dummyImage1() {
    return 'assets/new-assets/sample-image/drawable-hdpi/banner.png';
  }

  get dummyImage2() {
    return 'assets/new-assets/sample-image/drawable-hdpi/banner-2.png';
  }

  get bootcampBG() {
    return 'assets/new-assets/bootcamp.svg';
  }

  get eventBG() {
    return 'assets/new-assets/event2.svg';
  }

  get challengeBG() {
    return 'assets/new-assets/challenge.svg';
  }

  fetchData() {
    this._route.data.subscribe((resolvedState) => {
      resolvedState.events.state.subscribe(
        (eventsResponse) => {
          console.log(eventsResponse);
          this.events = eventsResponse;
        },
        (err) => {
          console.log(err);
        }
      );

      resolvedState.banner.state.subscribe(
        (bannerResponse) => {
          console.log(bannerResponse);
          this.banners = bannerResponse;
        },
        (err) => {
          console.log(err);
        }
      );
    });
  }

  getEventImage(filename: string) {
    return this._eventService.getEventImage(filename);
  }

  // getChallengeImage(filename: string) {
  //   return this._eventService.getChallengeImage(filename);
  // }

  getEventTypeCssClass(type: string) {
    switch (+type) {
      case EventType.Event: {
        return 'category category--event';
      }
      case EventType.Bootcamp: {
        return 'category category--bootcamp';
      }
      case EventType.Challenge: {
        return 'category category--challenge';
      }
    }
  }

  getEventTypeString(type: string) {
    switch (+type) {
      case EventType.Event: {
        return 'Acara';
      }
      case EventType.Bootcamp: {
        return 'Bootcamp';
      }
      case EventType.Challenge: {
        return 'Tantangan';
      }
    }
  }

  getEventDate(dateString: string) {
    return moment(dateString, 'YYYY-MM-DD').toDate();
  }

  doRefresh(event: any) {
    this.banners.isShell = true;
    this.events.isShell = true;

    const eventDataStore = this._eventService.getListDataStore(true);
    const bannerDataStore = this._eventService.getBannerDataStore(true);

    combineLatest(eventDataStore.state, bannerDataStore.state)
      .pipe(takeUntil(this.destroySubscription))
      .subscribe(([eventsResponse, bannerResponse]) => {
        console.log(eventsResponse);
        console.log(bannerResponse);

        this.events = eventsResponse;
        this.banners = bannerResponse;

        if (!this.events.isShell || !this.banners.isShell) {
          event.target.complete();
        }
      });
  }

  goBack() {
    this._navCtrl.navigateBack(['app/home']);
  }

  goToBootcamps() {
    this._router.navigate(['app/events/category', '2']);
  }

  goToEvents() {
    this._router.navigate(['app/events/category', '1']);
  }

  goToChallenge() {
    this._router.navigate(['app/events/challenges']);
  }

  goToEventDetail(detailId: string, typeId: string) {
    console.log({ detailId, typeId });

    if (+typeId === EventType.Event || +typeId === EventType.Bootcamp) {
      this._navCtrl.navigateForward(['./', detailId], {
        relativeTo: this._route,
      });
    }
    if (+typeId === EventType.Challenge) {
      this._navCtrl.navigateForward(['./challenges/challenge-detail/', detailId], {
        relativeTo: this._route,
      });
    }
  }

  goToChallengeDetail(id: string) {
    this._navCtrl.navigateForward('/app/events/challenges/challenge-detail/' + id);
  }
}
