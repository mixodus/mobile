import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/events-list/events-list.module').then((m) => m.EventsListPageModule),
      },
      {
        path: 'category/:event_type',
        loadChildren: () =>
          import('./pages/events-list-by-category/events-list-by-category.module').then(
            (m) => m.EventsListByCategoryPageModule
          ),
      },
      {
        path: 'challenges',
        loadChildren: () =>
          import('../../challenges/challenges.module').then(
            (m) => m.ChallengesPageModule
          ),
      },
      {
        path: ':id',
        loadChildren: () =>
          import('./pages/event-detail/event-detail.module').then((m) => m.EventDetailPageModule),
      },
      {
        path: 'register/:id',
        loadChildren: () =>
          import('./pages/event-registration/registration.module').then(
            (m) => m.RegistrationPageModule
          ),
      },
    ],
  },
  {
    path: 'events-list-by-category',
    loadChildren:
      './pages/events-list-by-category/events-list-by-category.module#EventsListByCategoryPageModule',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventRoutingModule {}
