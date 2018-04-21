import { Component, ChangeDetectorRef } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { IonicPage, NavController, LoadingController, NavParams, ToastController } from 'ionic-angular';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

import { LoginPage } from '../login/login';
import { MyOrderPage } from '../my-order/my-order';
import { Profile } from '../../models/profile';
import { Menu } from '../../models/menu';
import { Order } from '../../models/order';


/**
 * Generated class for the MakeOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-make-order',
  templateUrl: 'make-order.html',
})
export class MakeOrderPage {

	menuID: string;
	order= {} as Order;
  menus: Observable<any[]>;
  profileData: Observable<any[]>;
  orders: Observable<any[]>;

  constructor(private geolocation : Geolocation,
    private afAuth: AngularFireAuth, 
  	private afDatabase: AngularFireDatabase, 
  	public navParams: NavParams, 
  	private toast: ToastController,
  	public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    private changeDetector: ChangeDetectorRef) {
  	this.menuID = this.navParams.get('key');  
  }
  ngAfterViewChecked(){
    this.changeDetector.detectChanges();
  }
  addOrder(order){
      order.paid = false;
      this.afDatabase.list(`order/`).push(order)
        .then(() => this.navCtrl.setRoot(MyOrderPage));
      
  }
  ionViewDidLoad() {
    this.afAuth.authState.take(1).subscribe(data => {
        this.profileData = this.afDatabase.object(`profile/${data.uid}`),
        this.menus = this.afDatabase.object(`menu-list/${this.menuID}`)
    });
  }

}
