import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/registration-and-login/registration-and-login.module').then(
        (m) => m.RegistrationAndLoginModule
      ),
  },
  // {
  //   path: 'auth/login',
  //   loadChildren: () => import('./login/login.module').then((m) => m.LoginPageModule),
  // },
  // {
  //   path: 'auth/signup',
  //   loadChildren: () => import('./signup/signup.module').then((m) => m.SignupPageModule),
  // },
  // {
  //     path: 'auth/reset-password/:id',
  //     resolve: {
  //       data : DataResolverService
  //     },
  //     loadChildren: () => import('./reset-password/reset-password.module').then(m => m.ResetPasswordPageModule)
  // },
  {
    path: 'auth/forgot-password',
    loadChildren: () =>
      import('./forgot-password/forgot-password.module').then((m) => m.ForgotPasswordPageModule),
  },
  {
    path: 'update-app',
    loadChildren: () =>
      import('./update-app/update-app/update-app.module').then((m) => m.UpdateAppPageModule),
  },
  // {
  //   path: 'page-not-found',
  //   loadChildren: () =>
  //     import('./page-not-found/page-not-found.module').then((m) => m.PageNotFoundModule),
  // },
  {
    path: 'open-url',
    loadChildren: () => import('./openurl/openurl.module').then((m) => m.OpenurlPageModule),
  },
  {
    path: 'getting-started',
    loadChildren: () => import('./bio/bio.module').then((m) => m.BioPageModule),
  },
  // { path: 'getting-started', loadChildren: () => import('./getting-started/getting-started.module').then(m => m.GettingStartedPageModule)},
  {
    path: 'walkthrough',
    loadChildren: () =>
      import('./walkthrough/walkthrough.module').then((m) => m.WalkthroughPageModule),
  },
  {
    path: 'activity',
    loadChildren: () => import('./activity/activity.module').then((m) => m.ActivityPageModule),
  },


  {
    path: 'app',
    loadChildren: () => import('./tabs/tabs.module').then((m) => m.TabsPageModule),
    // canActivate: [AuthGuardService],
  },
  {
    path: 'app',
    redirectTo: 'app/home',
    pathMatch: 'full',
  },
  {
    path: 'app/home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomePageModule),
    // canActivate: [AuthGuardService],
  },


  {
    path: 'app/challenges',
    redirectTo: 'app/community/challenges',
    pathMatch: 'full',
  },
  {
    path: 'app/leaderboard',
    redirectTo: 'app/community/leaderboard',
    pathMatch: 'full',
  },
  {
    path: 'app/user/level',
    loadChildren: () => import('./level/level.module').then((m) => m.LevelPageModule)
  },
  {
    path: 'app/user/history',
    loadChildren: () =>
      import('./user/profile/history/history.module').then((m) => m.HistoryPageModule),
  },
  {
    path: 'app/user/friend-request',
    loadChildren: () =>
      import('./user/friend-request/friend-request.module').then((m) => m.FriendRequestPageModule),
    canActivate: [AuthGuardService],
  },

  {
    path: 'app/user/friend-list',
    loadChildren: () =>
      import('./user/friend-list/friend-list.module').then((m) => m.FriendListPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'app/user/edit',
    loadChildren: () =>
      import('./user/profile/edit/profile-edit.module').then((m) => m.EditPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'app/notifications',
    loadChildren: () =>
      import('./notifications/notifications.module').then((m) => m.NotificationsPageModule),
    // canActivate: [AuthGuardService],
  },
  {
    path: 'app/user/redeem-points',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./redeem-points/redeem-points.module').then((m) => m.RedeemPointsPageModule),
        canActivate: [AuthGuardService],
      },
      {
        path: 'redeem-history',
        loadChildren: () =>
          import('./redeem-points/redeem-history/redeem-history.module').then(
            (m) => m.RedeemHistoryPageModule
          ),
      },
      {
        path: 'redeem-menu',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./redeem-points/redeem-menu/redeem-menu.module').then(
                (m) => m.RedeemMenuPageModule
              ),
            canActivate: [AuthGuardService],
          },
          {
            path: 'redeem-detail',
            loadChildren: () =>
              import('./redeem-points/redeem-detail/redeem-detail.module').then(
                (m) => m.RedeemDetailPageModule
              ),
            canActivate: [AuthGuardService],
          },
        ],
      },
      {
        path: 'redeem-item/:id',
        loadChildren: () =>
          import('./redeem-points/redeem-item/redeem-item.module').then(
            (m) => m.RedeemItemPageModule
          ),
        canActivate: [AuthGuardService],
      },
    ],
  },
  {
    path: 'app/user/referral',
    loadChildren: () => import('./referral/referral.module').then((m) => m.ReferralPageModule),
    // canActivate: [AuthGuardService],
  },
  {
    path: 'app/user/work-experiences',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./user/profile/work-experiences/work-experiences.module').then(
            (m) => m.WorkExperiencesPageModule
          ),
        canActivate: [AuthGuardService],
      },
      {
        path: 'edit-work-experience',
        loadChildren: () =>
          import(
            './user/profile/work-experiences/edit-work-experience/edit-work-experience.module'
            ).then((m) => m.EditWorkExperiencePageModule),
        canActivate: [AuthGuardService],
      },
    ],
  },
  {
    path: 'app/user/projects',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./user/profile/projects/projects.module').then((m) => m.ProjectsPageModule),
        canActivate: [AuthGuardService],
      },
      {
        path: 'edit-project',
        loadChildren: () =>
          import('./user/profile/projects/edit-project/edit-project.module').then(
            (m) => m.EditProjectPageModule
          ),
        canActivate: [AuthGuardService],
      },
    ],
  },
  {
    path: 'app/user/skills',
    children: [
      // {
      //   path: '',
      //   loadChildren: () => import('../user/profile/skills/skills.module').then(m => m.SkillsPageModule)
      // },
      {
        path: '',
        loadChildren: () =>
          import('./user/profile/skills/add-skills/add-skills.module').then(
            (m) => m.AddSkillsPageModule
          ),
        canActivate: [AuthGuardService],
      },
    ],
  },
  {
    path: 'app/user/educations',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./user/profile/educations/educations.module').then((m) => m.EducationsPageModule),
        canActivate: [AuthGuardService],
      },
      {
        path: 'edit-education',
        loadChildren: () =>
          import('./user/profile/educations/edit-education/edit-education.module').then(
            (m) => m.EditEducationPageModule
          ),
        canActivate: [AuthGuardService],
      },
    ],
  },
  {
    path: 'app/user/certification',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./user/profile/certification/certification.module').then((m) => m.CertificationPageModule),
        canActivate: [AuthGuardService],
      },
      {
        path: 'edit-certification',
        loadChildren: () =>
          import('./user/profile/certification/edit-certification/edit-certification.module').then(
            (m) => m.EditCertificationPageModule
          ),
        canActivate: [AuthGuardService],
      },
    ]
  },
  {
    path: 'app/user/change-password',
    loadChildren: () =>
      import('./user/profile/change-password/change-password.module').then(
        (m) => m.ChangePasswordPageModule
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: 'app/events/challenges/challenge-detail',
    children: [
      {
        path: ':id',
        loadChildren: () =>
          import('./challenges/challenge-detail/challenge-detail.module').then(
            (m) => m.ChallengeDetailPageModule
          ),
      },
      {
        path: 'quiz/:id',
        loadChildren: () => import('./quiz/quiz.module').then((m) => m.QuizPageModule),
      },
    ],
  },
  {
    path: 'app/user/achievements',
    loadChildren: () =>
      import('./user/profile/achievements/achievements.module').then(
        (m) => m.AchievementsPageModule
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: 'app/home/event-detail',
    loadChildren: () =>
      import('./events/details/event-details.module').then((m) => m.EventDetailsPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'app/home/event-registration',
    loadChildren: () =>
      import('./events/registration/registration.module').then((m) => m.RegistrationPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'profile/:userId',
    loadChildren: () =>
      import('./user/friend-profile/profile.module').then((m) => m.ProfilePageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'app/jobs/job-detail/:id',
    loadChildren: () =>
      import('./jobs/job-detail/job-details.module').then((m) => m.JobDetailsPageModule),
    // canActivate: [AuthGuardService],
  },
  {
    path: 'app/jobs/easy-apply',
    loadChildren: () =>
      import('./jobs/job-detail/easy-apply/easy-apply.module').then((m) => m.EasyApplyPageModule),
    canActivate: [AuthGuardService],
  },
  { path: '**', redirectTo: 'page-not-found' },
  {
    path: 'app/user/accounts',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./user/profile/accounts/accounts.module').then((m) => m.AccountsPageModule),
      },
    ],
    canActivate: [AuthGuardService],
  },
  {
    path: 'edit-account',
    loadChildren: './user/profile/accounts/edit-account/edit-account.module#EditAccountPageModule',
  },
  {
    path: 'redeem-history-list',
    loadChildren:
      './redeem-points/redeem-history/redeem-history-list/redeem-history-list.module#RedeemHistoryListPageModule',
  },
  {
    path: 'my-rewards-list',
    loadChildren:
      './redeem-points/redeem-history/my-rewards-list/my-rewards-list.module#MyRewardsListPageModule',
  },
  {
    path: 'withdraw-history',
    loadChildren:
      './referral/withdraw/withdraw-history/withdraw-history.module#WithdrawHistoryPageModule',
  },
  { path: 'popover', loadChildren: './popover/popover.module#PopoverPageModule' },
  { path: 'history', loadChildren: './user/profile/history/history.module#HistoryPageModule' },
  { path: 'academy', loadChildren: './academy/academy.module#AcademyPageModule' }

];

const developerName = 'Hendra';

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
