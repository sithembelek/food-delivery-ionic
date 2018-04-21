import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FoodTypePage } from './food-type';

@NgModule({
  declarations: [
    FoodTypePage,
  ],
  imports: [
    IonicPageModule.forChild(FoodTypePage),
  ],
})
export class FoodTypePageModule {}
