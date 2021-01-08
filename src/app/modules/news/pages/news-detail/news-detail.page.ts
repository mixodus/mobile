import { Component, HostBinding, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { NewsDetail } from '../../../../core/models/news/NewsResponse';
import { NewsService } from '../../services/news.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from '../../../../services/global.service';
import { AuthenticationService } from '../../../../services/auth/authentication.service';
import { ActivatedRouteSnapshot } from '@angular/router';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.page.html',
  styleUrls: ['./news-detail.page.scss'],
})
export class NewsDetailPage implements OnInit {
  profileImg = './assets/sample-images/user/default-profile.svg';
  replyOutline = './assets/images/reply-outline.svg';


  @HostBinding('class.is-shell') get isShell() {
    return this.newsDetail && this.newsDetail.isShell;
  }

  constructor(
    private _navCtrl: NavController,
    private _route: ActivatedRoute,
    private _newsService: NewsService,
    private loadingCtrl: LoadingController,
    private globalService: GlobalService,
    private auth: AuthenticationService,
    private http: HttpClient,
  ) {

  }

  imageBaseUrl = 'http://dev-talents-api.oneindonesia.id/uploads/news/';
  // newsDetail: NewsResponse & ShellModel;
  newsDetail: NewsDetail;
  destroySubscription = new Subject<any>();
  newsId = '';

  ngOnInit() {
    console.log('init')
    this._route.paramMap.subscribe(params => {
      this.newsId = params.get('news-id');
    });

    this._route.data.subscribe(
      (resolvedRouteData) => {
        const newsDetailStore = resolvedRouteData['newsDetail'];
        newsDetailStore.state
          .subscribe(
            (state) => {
              this.newsDetail = state;
            },
            (error) => {
            }
          );
      },
      (error) => {
      }
    );
    this.getCommentDetail();
  }

  async getCommentDetail() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': `${this.auth.token}`
    });
    const options = { headers: headers };

    const body = {};

    const commentDetailEndpoint =
      this.globalService.apiUrl +
      'api/news/comment' + '?news_id=' + this.newsId;

    this.http.get(commentDetailEndpoint, options).pipe(
      finalize(() => this.loadingCtrl.dismiss())
    ).subscribe((data: any) => {
        console.log('data detail comment: ', data);
      }, (err) => {
      }
    );
  }

  ionViewWillEnter(): void {
    this.doRefresh();
  }

  doRefresh(event?: any) {
    this.newsDetail.isShell = true;

    this._route.paramMap.subscribe(params => {
      this.loadingCtrl.create()
        .then((loadingEl) => {
          loadingEl.present();
          const newsDetailDateStore = this._newsService.getNewsDetailDateStore(params.get('news-id'), true);

          newsDetailDateStore.state.pipe(takeUntil(this.destroySubscription)).subscribe((data) => {
            this.newsDetail = this.extractingNewsDetail(data);
            if (event) {
              event.target.complete();
            }
            if (!this.newsDetail.isShell) {
              loadingEl.dismiss();
            }
          });
        });
    });

    this.getCommentDetail();
  }

  extractingNewsDetail(data) {
    return {
      data: !data.isShell ? this.formattingNewsDetail(data.data[0]) : null,
      error: data.error,
      isShell: data.isShell,
      message: data.message,
      status: data.status
    };
  }

  formattingNewsDetail(data) {
    console.log('data: ', data);
    let newsType = '';
    switch (data.news_type_id) {
      case '3':
        newsType = 'Olahraga';
        break;
      case '6':
        newsType = 'Breaking News';
        break;
      case '1':
        newsType = 'Event';
        break;
      case '2':
        newsType = 'Karir';
        break;
      case '5':
        newsType = 'Pendidikan';
        break;
    }
    return {
      newsPhoto: data.news_photo,
      newsType: newsType,
      newsTitle: data.news_title,
      newsDetail: data.news_details,
      newsDate: data.created_at
    };
  }

  convertKebabCase(formattedNewsType: string) {
    if (formattedNewsType) {
      return formattedNewsType
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map(x => x.toLowerCase())
        .join('-');
    }
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

  handleButtonBackClick() {
    this._navCtrl.back();
  }
}
