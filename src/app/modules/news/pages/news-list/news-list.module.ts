import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NewsListPage } from './news-list.page';
import { NewsListResolver } from './news-list.resolver';
import { ComponentsModule } from '../../../../components/components.module';
import { BannerResolver } from '../banner.resolver';

const routes: Routes = [
  {
    path: '',
    component: NewsListPage,
    resolve: {
      data: NewsListResolver,
      banner: BannerResolver
    },
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [NewsListPage],
  providers: [NewsListResolver,BannerResolver],
})
export class NewsListPageModule {}
