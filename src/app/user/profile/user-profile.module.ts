import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserProfilePage } from './user-profile.page';
import { UserService } from '../user.service';
import { UserProfileResolver } from '../profile/user-profile.resolver';
import { ComponentsModule } from '../../components/components.module';
import { LanguageService } from '../../language/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { LevelResolver } from '../../level/level.resolver';
import { LevelService } from '../../level/level.service';

const routes: Routes = [
  {
    path: '',
    component: UserProfilePage,
    resolve: {
      dataUser: UserProfileResolver,
      dataLevel: LevelResolver
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
    RouterModule.forChild(routes)
  ],
  declarations: [UserProfilePage],
  providers: [
    UserProfileResolver,
    UserService,
    LevelResolver,
    LevelService,
    LanguageService
  ]
})
export class UserProfilePageModule {}
