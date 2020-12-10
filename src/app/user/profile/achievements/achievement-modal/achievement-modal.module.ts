import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AchievementModalComponent } from './achievement-modal.component';

@NgModule({
  declarations: [AchievementModalComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  entryComponents: [AchievementModalComponent],
  exports: [AchievementModalComponent]
})
export class AchievementModalModule { }
