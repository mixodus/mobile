import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { NgMathPipesModule } from 'angular-pipes';
import { FloorPipe } from 'angular-pipes';

import { TimeDifferencePipe } from './time-difference.pipe';
import { TimeAgoPipe } from './time-ago.pipe';
import { TruncatePipe } from './truncate.pipe';

@NgModule({
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    NgMathPipesModule
  ],
  declarations: [
    TimeDifferencePipe,
    TimeAgoPipe,
    TruncatePipe
  ],
  exports: [
    FloorPipe,
    TimeDifferencePipe,
    TimeAgoPipe,
    TruncatePipe
  ],
  entryComponents: [],
})
export class PipesModule {}
