import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { Observable } from 'rxjs/Observable';

import { Profile } from '../../models/profile';
import { Menu } from "../../models/menu";
import { Order } from "../../models/order";

import { MenuDescPage } from '../menu-desc/menu-desc';
import { OrderListPage } from '../order-list/order-list';
import { AddMenuPage } from '../add-menu/add-menu';

/**
 * Generated class for the MenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  menus: Observable<any[]>;
  deleteMenus: FirebaseObjectObservable<any>;
  profileData: Observable<any[]>;
  orders: Observable<any[]>;
  uid: string="";
  
  constructor(
  	public loadingCtrl: LoadingController, 
    public alertCtrl: AlertController, 
    private afDatabase: AngularFireDatabase, 
    private afAuth: AngularFireAuth, 
    public navCtrl: NavController, 
    public navParams: NavParams
    ) {
  }
  checkOrder(){
    this.navCtrl.push(OrderListPage);
  }
  openModal(menuID: string) {
    this.navCtrl.push(MenuDescPage, {key: menuID});
  }
  addMenu(){
    this.navCtrl.push(AddMenuPage);
  }
  deleteMenu(menuID: string){
    this.deleteMenus = this.afDatabase.object(`profile/${this.uid}/menu-list/${menuID}`);
    let confirm = this.alertCtrl.create({
      title: 'Delete Menu',
      message: 'Are you sure you want to delete this menu?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            let loader = this.loadingCtrl.create({
            content: "Deleting Menu...",
            duration: 1000
            });
            loader.present();
            this.deleteMenus.remove();
            this.navCtrl.setRoot(MenuPage);
          }
        }
      ]
    });
    confirm.present();
  }
  ionViewDidLoad() {
    this.afAuth.authState.take(1).subscribe(data => {
        this.profileData = this.afDatabase.object(`profile/${data.uid}`),
        this.menus = this.afDatabase.list(`profile/${data.uid}/menu-list/`)
        this.uid = `${data.uid}`;
    });
  }

}
