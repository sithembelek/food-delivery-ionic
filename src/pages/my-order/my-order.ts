import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController, NavParams, ViewController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { Subscription } from 'rxjs/Subscription';

import { ProfilePage } from '../profile/profile';
import { EditMenuPage } from '../edit-menu/edit-menu';
import { TrackRunnerPage } from '../track-runner/track-runner';
import { Profile } from '../../models/profile';
import { Menu } from '../../models/menu';
import { Order } from '../../models/order';

/**
 * Generated class for the MyOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-order',
  templateUrl: 'my-order.html',
})
export class MyOrderPage {

  menu = {} as Menu;
  menus: Observable<any[]>;
  profileData: Observable<any[]>;
  orders: Subscription;
  public newO: Order[] = [];
  public paid: Order[] = [];
  public processing: Order[] = [];
  public delivering: Order[] = [];
  public received: Order[] = [];
  public cancelled: Order[] = [];
  viewNew: boolean;
  viewPaid: boolean;
  viewProcessing: boolean;
  viewDelivering: boolean;
  viewCompleted: boolean;
  viewCancelled: boolean;

  constructor(
    private afAuth: AngularFireAuth, 
    private afDatabase: AngularFireDatabase, 
    public navParams: NavParams, 
    public navCtrl: NavController,
    public loadingCtrl: LoadingController
    ) {

      this.viewNew = false;
      this.viewPaid = false;
      this.viewProcessing = false;
      this.viewDelivering = false;
      this.viewCompleted = false;
      this.viewCancelled = false;
  }
  viewOrder(status: string)
  {
    if(status == "all")
    {
      this.navCtrl.setRoot(this.navCtrl.getActive().component);
    }
    else if(status == "new")
    {
      this.viewNew = true;
      this.viewPaid = false;
      this.viewProcessing = false;
      this.viewDelivering = false;
      this.viewCompleted = false;
      this.viewCancelled = false;
    }
    else if(status == "paid")
    {
      this.viewNew = false;
      this.viewPaid = true;
      this.viewProcessing = false;
      this.viewDelivering = false;
      this.viewCompleted = false;
      this.viewCancelled = false;      
    }
    else if(status == "processing")
    {
      this.viewNew = false;
      this.viewPaid = false;
      this.viewProcessing = true;
      this.viewDelivering = false;
      this.viewCompleted = false;
      this.viewCancelled = false;      
    }
    else if(status == "delivering")
    {
      this.viewNew = false;
      this.viewPaid = false;
      this.viewProcessing = false;
      this.viewDelivering = true;
      this.viewCompleted = false;
      this.viewCancelled = false;      
    }
    else if(status == "completed")
    {
      this.viewNew = false;
      this.viewPaid = false;
      this.viewProcessing = false;
      this.viewDelivering = false;
      this.viewCompleted = true;
      this.viewCancelled = false;      
    }
    else if(status == "cancelled")
    {
      this.viewNew = false;
      this.viewPaid = false;
      this.viewProcessing = false;
      this.viewDelivering = false;
      this.viewCompleted = false;
      this.viewCancelled = true;      
    }
  }
  trackRunner(){
    this.navCtrl.push(TrackRunnerPage);
  }
  ionViewWillLoad(){
    this.afAuth.authState.take(1).subscribe(data => {
        this.profileData = this.afDatabase.object(`profile/${data.uid}`),
        this.orders = this.afDatabase.list(`profile/${data.uid}/order`).take(1).subscribe(snapshot =>{
          snapshot.forEach(data =>{
          if(`${data.status}` == '1')
          {
            this.viewNew = true;
            this.newO.push(data);
          }
          else if(`${data.status}` == '2')
          {
            this.viewPaid = true;
            this.paid.push(data);
          }
          else if(`${data.status}` == '3')
          {
            this.viewProcessing = true;
            this.processing.push(data);
          }
          else if(`${data.status}` == '4')
          {
            this.viewDelivering = true;
            this.delivering.push(data);
          }
          else if(`${data.status}` == '5')
          {
            this.viewCompleted = true;
            this.received.push(data);
          }
          else if(`${data.status}` == '6')
          {
            this.viewCancelled = true;
            this.cancelled.push(data);
          }
        })
        })
       });
  }
}
