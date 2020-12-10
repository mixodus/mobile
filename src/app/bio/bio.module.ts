import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '../components/components.module';
import { BioPage } from './bio.page';
import { DecimalPipe } from '@angular/common';

const routes: Routes = [
  {
    path: '',
    component: BioPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
  ],
  declarations: [BioPage],
  providers: [DecimalPipe],
  entryComponents: [],
})
export class BioPageModule {}
