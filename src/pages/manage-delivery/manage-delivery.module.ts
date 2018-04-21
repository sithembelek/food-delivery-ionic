import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManageDeliveryPage } from './manage-delivery';

@NgModule({
  declarations: [
    ManageDeliveryPage,
  ],
  imports: [
    IonicPageModule.forChild(ManageDeliveryPage),
  ],
})
export class ManageDeliveryPageModule {}
