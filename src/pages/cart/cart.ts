import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, PopoverController, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';

import { Menu } from '../../models/menu';
import { Profile } from '../../models/profile';
import { Order } from '../../models/order';
import { PositionModel } from '../../models/position.model';
import { MakePaymentPage } from '../make-payment/make-payment';
import { SelectMapPage } from '../select-map/select-map';
/**
 * Generated class for the CartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

	empty:boolean;
	notEmpty:boolean;
	orderData:Subscription;
	public orders: Order[] = [];
	public menuss: Menu[] = [];
	count:number;
	menuData: Subscription;
	profileDetails: Subscription;
	menuID: string;
	menuPhoto: any;
	menuName: any;
	menuPrice: any;
	order = {} as Order;
	uid: string;
	subtotal: number=0;
	total:number=0;
	deliveryCost=3; //should based on delivery distance
	location: any;
  locationName: string;
  pageKey: string = "cart";
  locationID: string;
  loc: Subscription;
  locData: PositionModel[] = [];
  onlinePayment:boolean = false;
  fdsp: string;
  orderList = {} as Order;
  quantity: any;
  totalPrice: any;
  locationAddress: string;
  constructor(
  	viewCtrl: ViewController,
    private changeDetector: ChangeDetectorRef,
  	public navCtrl: NavController,
    private afAuth: AngularFireAuth, 
  	private afDatabase: AngularFireDatabase,
  	public loadingCtrl: LoadingController,  
  	public navParams: NavParams,
    public alertCtrl: AlertController,
    public popoverCtrl: PopoverController
  ){
    this.locationID = this.navParams.get('key');
  	this.empty = false;
  }
  ngAfterViewChecked(){
    this.changeDetector.detectChanges();
  }
  deleteOrder(orderID: string){
    let confirm = this.alertCtrl.create({
      title: 'Delete Order',
      message: 'Are you sure you want to delete this order?',
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
            this.afDatabase.object(`profile/${this.uid}/order/${orderID}`).remove();
            let loader = this.loadingCtrl.create({
            content: "Please wait...",
            duration: 3000
            });
            loader.present();
            this.navCtrl.pop();
          }
        }
      ]
    });
    confirm.present();  	
  }
  continueShopping(){
  	this.navCtrl.pop();
  }
  /*
  payment(){
    //this.afDatabase.list(`profile/${this.uid}/order/`).update({location: this.locationName});
  	this.navCtrl.push(MakePaymentPage, {loc: location});
  }*/
  openMap(){
    this.navCtrl.push(SelectMapPage, {key: 'cart'});
  }
  payment(pay: string)
  {
    if(pay == 'cash')
    {
      this.afAuth.authState.take(1).subscribe(data => {
        this.orderData = this.afDatabase.list(`profile/${data.uid}/order/`).take(1).subscribe(snapshot =>{
          snapshot.forEach(data =>{
            if(`${data.status}` == '0')
            {
              this.fdsp = `${data.fdsp}`;
              console.log(`${snapshot.$key}`);
              this.quantity = `${data.quantity}`;
              this.totalPrice = `${data.totalPrice}`;
              this.afDatabase.object(`profile/${this.uid}/order/${data.$key}`).update({ status: '1', paid: '0' });  
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
      //this.navCtrl.setRoot(MyOrderPage);
    }
    if(pay == 'online')
    {
      this.onlinePayment = true;
    }
  }
  selectAddress(address){
    if(address == ""){

    }
    else if(address == "addAddress"){
      this.locationAddress = "Add New Address";
      this.openMap();
    }
    else{
      this.locationAddress = address;
    }
  }
  ionViewDidLoad() {
  	this.count=0;
    this.locationName = this.navParams.get('locationName');
  	this.afAuth.authState.take(1).subscribe(data => {
  		this.uid = `${data.uid}`;
      this.orderData = this.afDatabase.list(`profile/${data.uid}/order/`).take(1).subscribe(snapshot =>{
      	snapshot.forEach(data =>{
      		if(`${data.status}` == '0')
      		{
      			this.count++;
      			this.empty = false;
      			this.notEmpty = true;
      			this.menuID = `${data.menu}`;
      			this.menuPrice = `${data.menuPrice}`;
      			console.log(this.subtotal + "before");
      			this.subtotal = this.subtotal + parseInt(this.menuPrice) ;
      			this.total = this.subtotal + this.deliveryCost;
      			console.log(this.subtotal + "after");
            this.orders.push(data);     

      		}//end if data.status
      	})//end data orderData
      }),//end snapshot orderData
      this.loc = this.afDatabase.list(`profile/${data.uid}/location/`).take(1).subscribe(snapshot =>{
        snapshot.forEach(data =>{
          this.locData.push(data);
        })
      })
      console.log(this.locData);
  	});//end data

  	if(this.count == 0)
  	{
  		this.empty = true;
  		this.notEmpty = false;
  	}
  	else
  	{
  		this.empty = false;
  		this.notEmpty = true;
  	}
  }

}
