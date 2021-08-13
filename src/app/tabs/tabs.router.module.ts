import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { TabsPage } from './tabs.page';
import { DataResolverService } from '../services/data/data-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'user',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../user/profile/user-profile.module').then((m) => m.UserProfilePageModule),
          },
          {
            path: 'level',
            loadChildren: () =>
              import('../level/level.module').then((m) => m.LevelPageModule),
          },
          {
            path: 'friends',
            loadChildren: () =>
              import('../community/community.module').then((m) => m.UserFriendsPageModule),
          },
          {
            path: 'accounts',
            children: [
              {
                path: '',
                loadChildren: () =>
                  import('../user/profile/accounts/accounts.module').then(
                    (m) => m.AccountsPageModule
                  ),
              },
              {
                path: 'edit-account',
                loadChildren: () =>
                  import('../user/profile/accounts/edit-account/edit-account.module').then(
                    (m) => m.EditAccountPageModule
                  ),
              },
            ],
          },
          {
            path: 'edit-account',
            loadChildren: () =>
              import('../user/profile/accounts/edit-account/edit-account.module').then(
                (m) => m.EditAccountPageModule
              ),
          },
        ],
      },
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () => import('../home/home.module').then((m) => m.HomePageModule),
          },
          {
            path: 'profile',
            loadChildren: () =>
              import('../user/friend-profile/profile.module').then((m) => m.ProfilePageModule),
          },
        ],
      },
      {
        path: 'news',
        children: [
          {
            path: '',
            loadChildren: () => import('../modules/news/news.module').then((m) => m.NewsModule),
          },
          {
            path: 'news-detail/:news-id',
            loadChildren: () => import('../modules/news/pages/news-detail/news-detail.module').then((m) => m.NewsDetailPageModule),
          }
        ]

      },
      {
        path: 'jobs',
        children: [
          {
            path: '',
            loadChildren: () => import('../jobs/jobs.module').then((m) => m.JobsPageModule),
          },
          // ,
          // {
          //   path: 'job-detail/:id',
          //   resolve:DataResolverService,
          //   loadChildren: () => import('../jobs/job-detail/job-detail.module').then(m => m.JobDetailPageModule)
          //
        ],
      },
      {
        path: 'events',
        children: [
          {
            path: '',
            loadChildren: () => import('../modules/event/event.module').then((m) => m.EventModule),
          },
        ],
      },
      {
        path: 'community',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../community/community.module').then((m) => m.UserFriendsPageModule),
          },
        ],
      },
      {
        path: 'connection',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../connection/connection/connection.module').then((m) => m.ConnectionPageModule),
          },
        ],
      },
      {
        path: 'referral',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../referral/referral.module').then((m) => m.ReferralPageModule),
          },
          {
            path: 'withdraw',
            loadChildren: () =>
              import('../referral/withdraw/withdraw.module').then((m) => m.WithdrawPageModule),
          },
          {
            path: 'withdraw-history',
            loadChildren: () =>
              import('../referral/withdraw/withdraw-history/withdraw-history.module').then(
                (m) => m.WithdrawHistoryPageModule
              ),
          },
        ],
      },
      {
        path: 'activity',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../activity/activity.module').then((m) => m.ActivityPageModule),
          },
        ],
      },
      {
        path: 'notifications',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../notifications/notifications.module').then(
                (m) => m.NotificationsPageModule
              ),
          },
        ],
      },
    ],
  },
  // /app/ redirect
  {
    path: 'job-detail',
    redirectTo: 'app/jobs/job-detail',
    pathMatch: 'full',
  },
  {
    path: 'achievements',
    redirectTo: 'app/referral/achievements',
    pathMatch: 'full',
  },
  {
    path: 'redeem-menu',
    redirectTo: 'app/user/redeem-points/redeem-menu',
    pathMatch: 'full',
  },
  {
    path: 'accounts',
    redirectTo: 'app/user/accounts',
    pathMatch: 'full',
  },
  {
    path: 'edit-account',
    redirectTo: 'app/user/accounts/edit-account',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), HttpClientModule],
  exports: [RouterModule],
  providers: [],
})
export class TabsPageRoutingModule {
}
