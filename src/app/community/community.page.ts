import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

// import { UserFriendsModel } from './user-friends.model';
// import { Observable } from 'rxjs';
// import { DataStore } from '../../../app/shell/data-store';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-user-friends',
  templateUrl: './community.page.html',
  styleUrls: [
    './styles/user-friends.page.scss',
    './styles/user-friends.shell.scss',
    './styles/user-friends.md.scss'
  ]
})
export class UserFriendsPage implements OnInit {
  // data: UserFriendsModel;

  // segmentValue = 'friends';
  // userImage = './assets/sample-images/user/default-profile.svg';
  // friendsList: Array<any>;
  // friendSearchList: Array<any>;
  // noSearch = true;
  // followersList: Array<any>;
  // followingList: Array<any>;
  // showFilters = false;

  // @HostBinding('class.is-shell') get isShell() {
  //   return (this.data && this.data.isShell) ? true : false;
  // }
  subscribe:any;

  constructor(private route: ActivatedRoute, private router: Router, private platform: Platform) { }

  ngOnInit(): void {
    // this.filterSearch('');
    // this.route.data.subscribe((resolvedRouteData) => {
    //   const friendsDataStore = resolvedRouteData['data'];

    //   friendsDataStore.state.subscribe(
    //     (state) => {
    //       this.data = state;
    //       this.friendsList = this.data.data;
    //       // this.followersList = this.data.followers;
    //       // this.followingList = this.data.following;
    //     },
    //     (error) => {}
    //   );
    // },
    // (error) => {});
  }

  // segmentChanged(ev): void {
  //   this.segmentValue = ev.detail.value;

  //   // Check if there's any filter and apply it
  // }

  // searchList(ev: any): void {
  //   // const query = (this.searchQuery && this.searchQuery !== null) ? this.searchQuery : '';

  //   // if (this.segmentValue === 'friends') {
  //   //   this.friendsList = this.filterList(this.data.friends, query);
  //   // } else if (this.segmentValue === 'followers') {
  //   //   this.followersList = this.filterList(this.data.followers, query);
  //   // } else if (this.segmentValue === 'following') {
  //   //   this.followingList = this.filterList(this.data.following, query);
  //   // }
  //   let searchValue : string = ev.detail.value;
  //   if(searchValue.length >= 3){
  //     this.filterSearch(searchValue);
  //     this.noSearch = false;
  //     // this.addToSearchHistory(searchValue);
  //     // this.hideSuggestion = true;
  //   } else if (searchValue.length <= 0){
  //     this.noSearch = true;
  //     // this.hideSuggestion = true;
  //   }
  // }

  // // filterList(list, query): Array<any> {
  // //   return list.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
  // // }

  // filterSearch(filter: string){
  //   if(filter != undefined && filter !='') {
  //     const searchDataSource: Observable<UserFriendsModel> = this.friendService.getFriendSearchDataSource(filter);
  //     const searchDataStore: DataStore<UserFriendsModel> = this.friendService.getFriendSearchStore(searchDataSource);
      
  //     searchDataStore.state.subscribe(
  //       (state) => {
  //         this.data = state;
  //         this.friendSearchList = this.data.data;
  //       }, 
  //       (error) => { }
  //     );
  //   }
  // }
  
  // gotoProfile(data) {
   
  //   let navigationExtras: NavigationExtras = {
  //     state: {
  //       data: data
  //     }
  //   };
  //   // this.navCtrl.navigateForward(['/profile'], navigationExtras);
  //   this.router.navigateByUrl('/profile/'+data.user_id);
  //   // this.router.navigateByUrl('/getting-started');
  // }


  // doRefresh(ev) {
  //   const friendsDataSource: Observable<UserFriendsModel> = this.friendService.getFriendsDataSource();
  //   const friendsDataStore: DataStore<UserFriendsModel> = this.friendService.getFriendsStore(friendsDataSource, true);
  //   friendsDataStore.state.subscribe(
  //     (state) => {
  //       this.data = state;
  //       this.friendsList = this.data.data;
  //     },
  //     (error) => { }
  //   );
  //   ev.target.complete();
  // }
  ionViewWillEnter(): void {
    this.subscribe = this.platform.backButton.subscribe(() => {
      this.router.navigateByUrl('app/home');
    })
  }
  ionViewDidLeave(){
    this.subscribe.unsubscribe();
  }
}
