import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController, NavParams, ViewController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database-deprecated';

import { Menu } from '../../models/menu';
import { Profile } from '../../models/profile';
import { Order } from '../../models/order';
import { MenuDescPage } from '../menu-desc/menu-desc';
import { ProfilePage } from '../profile/profile';
/**
 * Generated class for the EditMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-menu',
  templateUrl: 'edit-menu.html',
})
export class EditMenuPage {

	menuID: string;
  menus: FirebaseObjectObservable<any[]>;
  profileData: Observable<any[]>;
  orders: Observable<any[]>;
	menu = {} as Menu;

  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     public viewCtrl: ViewController,
     private afAuth: AngularFireAuth,
     private afDatabase: AngularFireDatabase,
     public alertCtrl: AlertController,
     private changeDetector: ChangeDetectorRef,
     public loadingCtrl: LoadingController
  	) {
  	this.menuID = this.navParams.get('key');  
  }
  ngAfterViewChecked(){
    this.changeDetector.detectChanges();
  }
  updateMenu(menu){
    this.menus.update(menu).then(() => this.navCtrl.setRoot(ProfilePage));
  }
  ionViewWillLoad(){
    this.afAuth.authState.take(1).subscribe(data => {
        this.profileData = this.afDatabase.object(`profile/${data.uid}`),
        this.menus = this.afDatabase.object(`profile/${data.uid}/menu-list/${this.menuID}`)
    });
  }
}
