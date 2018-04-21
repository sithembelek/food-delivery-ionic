import { Component, ViewChild } from '@angular/core';
import { Platform, LoadingController, Nav, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { WelcomePage } from '../pages/welcome/welcome';
import { HomePage } from '../pages/home/home';
import { FoodTypePage } from '../pages/food-type/food-type';
import { SelectRunnerPage } from '../pages/select-runner/select-runner';
import { ProfilePage } from '../pages/profile/profile';
import { SettingPage } from '../pages/setting/setting';
import { ManageDeliveryPage } from '../pages/manage-delivery/manage-delivery';
import { MyOrderPage } from '../pages/my-order/my-order';
import { MenuPage } from '../pages/menu/menu';
import { OrderListPage } from '../pages/order-list/order-list';
import { HelpPage } from '../pages/help/help';
import { SelfDeliveryPage } from '../pages/self-delivery/self-delivery';

@Component({
  templateUrl: 'app.html'
})
export class MyApp{
  @ViewChild(Nav) nav: Nav;
  rootPage:any;

  profileData: Observable<any[]>;
  uid: string="";
  fdsp: boolean = false;
  runner: boolean = false;
  runnerActive: boolean = false;
  runners: Subscription;
  selfDelivery:boolean = false;
  checkData: Subscription;
  pages: Array<{icon: string, title: string, component: any}>;
  runnerPages: Array<{icon: string, title: string, component: any}>;
  fdspPages: Array<{icon: string, title: string, component: any}>;
  selfDPages: Array<{icon: string, title: string, component: any}>;

  constructor(public menuCtrl: MenuController, public loadingCtrl: LoadingController, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
    this.runner=false;
    this.fdsp=false;
    this.selfDelivery = false;
    this.pages = [
      { icon: 'home', title: ' Home', component: FoodTypePage },
      { icon: 'person', title: ' Profile', component: ProfilePage },
      { icon: 'archive', title: ' Order History', component: MyOrderPage },
      { icon: 'settings', title: ' Settings', component: SettingPage},
      { icon: 'help-circle', title: ' Help', component: HelpPage}
    ];
    this.runnerPages = [
      { icon: 'walk', title: 'Delivery', component: ManageDeliveryPage }
    ];
    this.selfDPages = [
    { icon: 'walk', title: 'Self-Delivery', component: SelfDeliveryPage }
    ];
    this.fdspPages = [
      { icon: 'book', title: 'Menu', component: MenuPage },
      { icon: 'list-box', title: 'Order List', component: OrderListPage }
    ];
    this.afAuth.authState.subscribe( (authed) =>{
        if (authed) {
          this.profileData = this.afDatabase.object(`profile/${authed.uid}`),
          this.runners = this.afDatabase.object(`profile/${authed.uid}/`).take(1).subscribe(snapshot =>{
            if(`${snapshot.runner}` == '1')
            {
              this.runner = true;
            }
            if(`${snapshot.fdsp}` == '1')
            {
              this.fdsp = true;
            }
            if(`${snapshot.deliveryNo}` == '1')
            {
              this.selfDelivery = true;
            }
            if(`${snapshot.runnerActive}` == '1')
            {
              this.runnerActive = true;
            }
          });
          this.uid = `${authed.uid}`;
          this.rootPage = FoodTypePage;
        }
        else{
          this.rootPage = WelcomePage;
        }
      });
  }
  startRunner() {
    this.afAuth.authState.subscribe( (authed) =>{
      if(this.runnerActive == false){
        this.afDatabase.object(`profile/${authed.uid}`).update({ runnerActive: '0' })
      }   
      else{
        this.afDatabase.object(`profile/${authed.uid}`).update({ runnerActive: '1' });
      }
    });
  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
    console.log(page.component)
  }
  logout(){ 
    let loader = this.loadingCtrl.create({
    content: "Please wait...",
    duration: 1000
    });
    loader.present();
    this.runner=false;
    this.fdsp=false;
    this.selfDelivery = false;
    this.menuCtrl.close();
    this.afAuth.auth.signOut().then(function() {
    }, function(error) {
    });
    //this.rootPage = LoginPage;
  }
}