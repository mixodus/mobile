import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NewsDetailPage } from './news-detail.page';
import { ComponentsModule } from '../../../../components/components.module';
import { NewsService } from '../../services/news.service';
import { NewsDetailResolver } from './news-detail.resolver';

const routes: Routes = [
  {
    path: '',
    component: NewsDetailPage,
    resolve: {
      newsDetail: NewsDetailResolver
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    ReactiveFormsModule
  ],
  providers: [NewsService, NewsDetailResolver],
  declarations: [NewsDetailPage]
})
export class NewsDetailPageModule {
}
