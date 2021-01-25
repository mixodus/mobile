import { Component, HostBinding, OnInit } from '@angular/core';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { NewsDetail } from '../../../../core/models/news/NewsResponse';
import { NewsService } from '../../services/news.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../../../services/global.service';
import { AuthenticationService } from '../../../../services/auth/authentication.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NewsDetailService } from './news-detail.service';
import { NewsComment } from './newsModel';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.page.html',
  styleUrls: ['./news-detail.page.scss'],
})
export class NewsDetailPage implements OnInit {
  @HostBinding('class.is-shell') get isShell() {
    return this.newsDetail && this.newsDetail.isShell;
  }

  constructor(
    private _navCtrl: NavController,
    private _route: ActivatedRoute,
    private _newsService: NewsService,
    private newsDetailService: NewsDetailService,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private globalService: GlobalService,
    private auth: AuthenticationService,
    private http: HttpClient,
  ) {
    this.commentForm = new FormGroup({
      comment: new FormControl('', Validators.compose([]))
    });
  }

  newsDetail: NewsDetail;
  newsComment: NewsComment;
  commentForm: FormGroup;
  isCommentLoading = false;
  isReplyComment = false;
  currentNameToReply = '';
  currentCommentId = '';
  newsId = '';
  placeholderProfilePict = './assets/sample-images/user/default-profile.svg';
  replyOutline = './assets/images/reply-outline.svg';

  imageBaseUrl = 'https://dev-api.oneindonesia.id/uploads/news/';
  // newsDetail: NewsResponse & ShellModel;
  destroySubscription = new Subject<any>();


  ngOnInit() {
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
            (err) => {
              let message = '';
              if (err.error.message === undefined) {
                message = 'Permasalahan jaringan, mohon coba lagi.';
              } else {
                message = err.error.message;
              }

              this.presentToast(message);
              this.isCommentLoading = false;
            }
          );
      }
    );
    this.getCommentDetail();
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

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
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

  async getCommentDetail() {
    this.isCommentLoading = true;
    this.newsDetailService.getNewsComment(this.newsId)
      .pipe(finalize(() => this.isCommentLoading = false)).subscribe((data: any) => {
      this.newsComment = this.newsDetailService.formattingCommentData(data.data);

    }, (err) => {
      let message = '';
      if (err.error.message === undefined) {
        message = 'Permasalahan jaringan, mohon coba lagi.';
      } else {
        message = err.error.message;
      }

      this.presentToast(message);
      this.isCommentLoading = false;
    });
  }

  submitComment() {
    const commentFormData = this.commentForm.value;

    if (commentFormData.comment) {
      this.isCommentLoading = true;
      let commentType = 'comment';
      let typeId = this.newsId;

      if (this.isReplyComment) {
        commentType = 'reply_comment';
        typeId = this.currentCommentId;
      }

      this.newsDetailService.postNewsComment(commentType, typeId, commentFormData.comment)
        .pipe(finalize(() => {
            this.isCommentLoading = false;
            this.getCommentDetail();
            this.commentForm.reset();
            this.setReplyOff();
          }
        )).subscribe(
        () => {
        }, (err) => {
          let message = '';
          if (err.error.message === undefined) {
            message = 'Permasalahan jaringan, mohon coba lagi.';
          } else {
            message = err.error.message;
          }

          this.presentToast(message);
          this.isCommentLoading = false;
        });
    }
  }

  setReplyOn(name, commentId) {
    this.isReplyComment = true;
    this.currentNameToReply = name;
    this.currentCommentId = commentId;
  }

  setReplyOff() {
    this.isReplyComment = false;
    this.currentNameToReply = '';
    this.currentCommentId = '';
  }
}
