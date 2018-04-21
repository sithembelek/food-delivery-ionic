import { Component } from '@angular/core';
import { ProfilePage } from '../profile/profile';
import { MyOrderPage } from '../my-order/my-order';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = MyOrderPage;
  tab3Root = ProfilePage;
  constructor() {
  }
}
