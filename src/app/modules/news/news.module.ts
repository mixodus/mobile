import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NewsComponent } from './news.component';
import { IonicModule } from '@ionic/angular';
import { NewsService } from './services/news.service';

const routes: Routes = [
  {
    path: '',
    component: NewsComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/news-list/news-list.module').then((m) => m.NewsListPageModule),
      },
      // This won't be used for now
      // {
      //   path: 'detail/:id',
      //   loadChildren: () =>
      //     import('./pages/news-detail/news-detail.module').then((m) => m.NewsDetailPageModule),
      // },
    ],
  },
];

@NgModule({
  declarations: [NewsComponent],
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes)],
  providers: [NewsService],
})
export class NewsModule {}
