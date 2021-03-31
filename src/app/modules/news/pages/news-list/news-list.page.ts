import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, IonRefresher, LoadingController } from '@ionic/angular';
import { NewsService } from '../../services/news.service';
import { NewsResponse } from '../../../../core/models/news/NewsResponse';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { ShellModel } from '../../../../shell/data-store';
import { takeUntil } from 'rxjs/operators';
import { InAppBrowserService } from '../../../../core/services/in-app-browser/in-app-browser.service';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.page.html',
  styleUrls: ['./news-list.page.scss'],
})
export class NewsListPage implements OnInit {
  constructor(
    private _route: ActivatedRoute,
    private _navCtrl: NavController,
    private _newsService: NewsService,
    private _inAppBrowser: InAppBrowserService,
    private loadingCtrl: LoadingController
  ) {
  }

  bannerConfig = {
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

  newsList: NewsResponse & ShellModel;
  bannerList: NewsResponse & ShellModel;

  destroySubscription = new Subject<any>();

  @HostBinding('class.is-shell') get isShell() {
    return this.newsList && this.newsList.isShell && this.bannerList && this.bannerList.isShell;
  }

  @ViewChild(IonRefresher, { static: false })
  refresher: IonRefresher;

  ngOnInit() {
    this.fetchData();
  }

  ionViewWillEnter() {
    this.refresher.disabled = false;

    // this.fetchData();
    this.doRefresh();
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

  getDate(dateString: string) {
    try {
      if (dateString) {
        return moment(dateString).toString();
      }

      return new Date();
    } catch {
      return new Date();
    }
  }

  fetchData() {
    //console.log('this._route: ', this._route);
    this._route.data.subscribe((resolvedState) => {
      //console.log('resolvedState: ', resolvedState);
      resolvedState.banner.state.subscribe(
        (data) => {
          //console.log(data);
          this.bannerList = data;
        },
        (err) => {
          //console.log(err);
        }
      );
    });
    this._route.data.subscribe((resolvedState) => {
      resolvedState.data.state.subscribe(
        (data) => {
          //console.log(data);
          this.newsList = data;
        },
        (err) => {
          //console.log(err);
        }
      );
    });
  }

  doRefresh(event?: any) {
    this.newsList.isShell = true;
    this.bannerList.isShell = true;

    this.loadingCtrl.create()
      .then((loadingEl) => {
        loadingEl.present();

        const newsDataStore = this._newsService.getNewsDataStore(true);
        const bannerDataStore = this._newsService.getBannerDataStore(true);

        newsDataStore.state.pipe(takeUntil(this.destroySubscription)).subscribe((res) => {
          this.newsList = res;
        });

        bannerDataStore.state.pipe(takeUntil(this.destroySubscription)).subscribe((res) => {
          this.bannerList = res;
          if (event) {
            event.target.complete();
          }

          if (!this.bannerList.isShell) {
            loadingEl.dismiss();
          }
        });
      });
  }

  goToNewsDetail(url: string) {
    this._inAppBrowser.openBrowser(url);
  }

  goBack() {
    this._navCtrl.navigateBack(['app/home']);
  }
}
