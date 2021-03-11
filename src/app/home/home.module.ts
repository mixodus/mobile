import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HomePage } from './home.page';
import { HomeService } from './home.service';
import { HomeResolver } from './home.resolver';
import { ComponentsModule } from '../components/components.module';
import { LanguageService } from '../language/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { HomeModalPage } from '../modal/update-modal/home-modal.page';
// import { NetworkServiceProviderService } from '../network-service-provider.service';
import { ZoomImageModalModule } from '../modal/zoom-image-modal/zoom-image-modal.module';
import { NewsResolver } from './news.resolver';
import { NewsService } from '../modules/news/services/news.service';
import { JobsResolver } from '../jobs/jobs.resolver';
import { JobsService } from '../jobs/jobs.service';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    resolve: {
      data: HomeResolver,
      news: NewsResolver,
      jobs: JobsResolver
    }
  }
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    ComponentsModule,
    ZoomImageModalModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HomePage, HomeModalPage],
  entryComponents: [HomeModalPage],
  providers: [
    HomeResolver,
    HomeService,
    LanguageService,
    NewsResolver,
    NewsService,
    JobsResolver,
    JobsService
    // NetworkServiceProviderService
  ]
})
export class HomePageModule {
}
