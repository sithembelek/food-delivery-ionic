import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ActionSheetController, PopoverController  } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { Subscription } from 'rxjs/Subscription';

import { ViewDirectionsPage } from '../view-directions/view-directions';
import { Delivery } from '../../models/delivery';
/**
 * Generated class for the SelfDeliveryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-self-delivery',
  templateUrl: 'self-delivery.html',
})
export class SelfDeliveryPage {
	profileData: Observable<any[]>;
	delivery: Observable<any[]>;
	public newD: Delivery[] = [];
	public completedD: Delivery[] = [];
	uid: string;
	viewNew: boolean;
	viewCompleted: boolean;
	orderData: Subscription;
	menuName: string;
	totalPrice: string;
	location: string;
	custData: Subscription;
	customerName:string;
	customerPhoneNo: string;
	fdspData: Subscription;
	fdspName: string;
	fdspPhoneNo: string;
	deliveryData: Subscription;
	orderID: string;
	custID: string;
	fdspID: string;
	deliveryID: string;
	deliveryData2: Subscription;

  constructor(    public loadingCtrl: LoadingController, 
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController, 
    private afDatabase: AngularFireDatabase, 
    private afAuth: AngularFireAuth, 
    public navCtrl: NavController, 
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController
  	) {
  }
  startDelivery(){
  	this.navCtrl.push(ViewDirectionsPage);
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
      this.viewCompleted = false;
    }
    else if(status == "completed")
    {
      this.viewNew = false;
      this.viewCompleted = true;  
    }
  }
  ionViewDidLoad() {
    this.afAuth.authState.take(1).subscribe(data => {
    	this.uid = `${data.uid}`;
        this.profileData = this.afDatabase.object(`profile/${data.uid}`),
        this.delivery = this.afDatabase.list(`profile/${data.uid}/delivery/`),
        this.deliveryData = this.afDatabase.list(`profile/${data.uid}/delivery/`).take(1).subscribe(snapshot =>{ 
        	snapshot.forEach(data =>{
        		this.deliveryID = `${data.$key}`;
        		this.orderID = `${data.orderID}`;
        		this.custID = `${data.custID}`;
        		this.fdspID = `${data.fdspID}`;
        		this.orderData = this.afDatabase.object(`profile/${this.custID}/order/${this.orderID}`).take(1).subscribe(snapshot =>{
        			this.menuName = `${snapshot.menuName}`;
        			this.totalPrice = `${snapshot.totalPrice}`;
        			this.afDatabase.object(`profile/${this.uid}/delivery/${this.deliveryID}`).update({menuName: this.menuName, totalPrice: this.totalPrice});
        		}),//end snapshot orderData
        		this.custData = this.afDatabase.object(`profile/${this.custID}`).take(1).subscribe(snapshot =>{
        			this.customerName = `${snapshot.name}`;
							this.customerPhoneNo = `${snapshot.phoneNo}`;
							this.afDatabase.object(`profile/${this.uid}/delivery/${this.deliveryID}`).update({customerName: this.customerName, customerPhoneNo: this.customerPhoneNo});
        		}),//end snapshot custData
        		this.fdspData = this.afDatabase.object(`profile/${this.fdspID}`).take(1).subscribe(snapshot =>{
        			this.fdspName = `${snapshot.name}`;
							this.fdspPhoneNo = `${snapshot.phoneNo}`;    
							this.afDatabase.object(`profile/${this.uid}/delivery/${this.deliveryID}`).update({fdspName: this.fdspName, fdspPhoneNo: this.fdspPhoneNo});    			
        		})//end of snapshot fdspData
        	})//end foreach snapshot data
        }),//end snapshot delivery data
        this.deliveryData2 = this.afDatabase.list(`profile/${data.uid}/delivery/`).take(1).subscribe(snapshot =>{
        	snapshot.forEach(data =>{
        		if(`${data.status}` == '0')
        		{
        			this.viewNew = true;
        			this.newD.push(data);
        		}
        		else if(`${data.status}` == '1')
        		{
        			this.viewCompleted=true;
        			this.completedD.push(data);
        		}
        	})
        })
    });
	}
}
