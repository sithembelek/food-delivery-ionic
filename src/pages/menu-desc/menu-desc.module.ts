import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MenuDescPage } from './menu-desc';

@NgModule({
  declarations: [
    MenuDescPage,
  ],
  imports: [
    IonicPageModule.forChild(MenuDescPage),
  ],
})
export class MenuDescPageModule {}
