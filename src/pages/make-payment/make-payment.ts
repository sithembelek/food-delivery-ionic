import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { MyOrderPage } from '../my-order/my-order';
import { Order } from '../../models/order';
/**
 * Generated class for the MakePaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-make-payment',
  templateUrl: 'make-payment.html',
})
export class MakePaymentPage {

	location: any;
	onlinePayment:boolean = false;
	orderData:Subscription;
	uid: string = "" ;
	fdsp: string;
	orderList = {} as Order;
	quantity: any;
	totalPrice: any;

  constructor(
  	public navCtrl: NavController, 
    private afAuth: AngularFireAuth, 
  	private afDatabase: AngularFireDatabase,
  	public navParams: NavParams) {
  	this.location = this.navParams.get('loc');
  }
  payment(pay: string)
  {
  	if(pay == 'cash')
  	{
	  	this.afAuth.authState.take(1).subscribe(data => {
	  		this.uid = `${data.uid}`;
	      this.orderData = this.afDatabase.list(`profile/${data.uid}/order/`).take(1).subscribe(snapshot =>{
	      	snapshot.forEach(data =>{
	      		if(`${data.status}` == '0')
	      		{
	      			this.fdsp = `${data.fdsp}`;
	      			console.log(`${snapshot.$key}`);
	      			this.quantity = `${data.quantity}`;
	      			this.totalPrice = `${data.totalPrice}`;
	      			this.afDatabase.object(`profile/${this.uid}/order/${data.$key}`).update({ status: '1', paid: 'false' });  
	      			this.orderList.menu = `${data.menu}`;
	      			this.orderList.quantity = parseInt(this.quantity);
	      			this.orderList.totalPrice = parseInt(this.totalPrice);
	      			this.orderList.customer = this.uid;
	      			console.log(`${data.$key}`);
	      			this.orderList.orderID = `${data.$key}`;
	      			//this.orderList.location = this.location;
	      			this.orderList.menuName = `${data.menuName}`;
	      			this.orderList.status = 1;
	      			this.orderList.menuPhoto = `${data.menuPhoto}`;
	      			this.orderList.paid = false;
	      			this.afDatabase.list(`profile/${data.fdsp}/list-order/`).push(this.orderList); 
	      		}//end if data.status
	      	})//end data orderData
	      })//end snapshot orderData

	  	});//end data
	  	this.navCtrl.setRoot(MyOrderPage);
  	}
  	if(pay == 'online')
  	{
  		this.onlinePayment = true;
  	}
  }

  ionViewDidLoad() {

  }

}
