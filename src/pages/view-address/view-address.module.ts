import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewAddressPage } from './view-address';

@NgModule({
  declarations: [
    ViewAddressPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewAddressPage),
  ],
})
export class ViewAddressPageModule {}
