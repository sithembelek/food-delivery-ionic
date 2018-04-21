import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ActionSheetController, PopoverController  } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { Subscription } from 'rxjs/Subscription';

import { Profile } from '../../models/profile';
import { Menu } from '../../models/menu';
import { Order } from '../../models/order';
import { Delivery } from '../../models/delivery';
import { PositionModel } from '../../models/position.model';
import { SelectRunnerPage } from '../select-runner/select-runner';
/**
 * Generated class for the OrderListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-list',
  templateUrl: 'order-list.html',
})
export class OrderListPage {

	statusO: string;
  menus: Observable<any[]>;
  profileData: Observable<any[]>;
  menu = {} as Menu;
  order = {} as Order;
  delivery = {} as Delivery;
  runners: PositionModel[] = [];
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
  uid: string;
  getData: Subscription;
  getLocation: Subscription;
  runnerLocationID : string;
  runnerLat: number;
  runnerLng: number;
  fdspLat: number;
  fdspLng: number;
  getFDSP: Subscription;
  fdspAddress: string;
  getFdspAddress: Subscription;
  distance: number;
  dataRunner: Observable<any[]>;
  orderData: Subscription;
  paidStr: string;
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
  constructor(
    public loadingCtrl: LoadingController, 
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController, 
    private afDatabase: AngularFireDatabase, 
    private afAuth: AngularFireAuth, 
    public navCtrl: NavController, 
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController
  	) {
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
  action(orderID, status, customerID, custOrderID){
  	if(status == 1 || status == 2)
  	{
	 	  let actionSheet = this.actionSheetCtrl.create({
	    title: 'Order Status',
	    buttons: [
	    	{
	      	text:'Processing',
	      	role: 'processing',
	      	handler: () => {
	        	console.log(custOrderID);
	          this.afDatabase.object(`profile/${this.uid}/list-order/${orderID}`).update({ status: '3' });
	          this.afDatabase.object(`profile/${customerID}/order/${custOrderID}`).update({ status: '3' });
					  let loader = this.loadingCtrl.create({
					  content: "Please wait...",
					  duration: 1000
					  });
					  loader.present();
					  this.navCtrl.setRoot(this.navCtrl.getActive().component);	      		
	      	}
	      },{
	        text: 'Cancel',
	        role: 'cancel',
	        handler: () => {
	          console.log('Cancel clicked');
	        }
	      }
	    ]
	  });
	  actionSheet.present(); 		
  	}
  	else if(status == 3)
  	{
	 	  let actionSheet = this.actionSheetCtrl.create({
	    title: 'Order Status',
	    buttons: [
	    	{
	      	text:'Select Runner',
	      	role: 'runner',
	      	handler: () => {
            // @ts-ignore
            let loader = this.loadingCtrl.create({
            content: "Searching for runner",
            duration: 3000
            });
            loader.present();
            var temp = this.runners[Math.floor(Math.random()*this.runners.length)];
            this.dataRunner = this.afDatabase.object(`profile/${temp.user}`);
	        	console.log(temp.user);
            let ev = {
              target : {
                getBoundingClientRect : () => {
                  return {
                    top: '100'
                  };
                }
              }
            };
            this.afDatabase.object(`profile/${this.uid}/list-order/${orderID}`).update({ status: '4', runner: temp.user });
            this.afDatabase.object(`profile/${customerID}/order/${custOrderID}`).update({ status: '4' });
            this.orderData = this.afDatabase.object(`profile/${customerID}/order/${custOrderID}`).take(1).subscribe(snapshot =>{
              if(`${snapshot.paid}` == 'true'){
                this.delivery.paid = 1;
              }
              else
              {
                this.delivery.paid = 0;
              }
            })		
            this.delivery.orderID = custOrderID;
            this.delivery.custID = customerID;
            this.delivery.fdspID = this.uid;
            this.delivery.runnerID = temp.user;
            this.delivery.status = 0;
            this.afDatabase.list(`profile/${temp.user}/delivery/`).push(this.delivery);
            this.deliveryData = this.afDatabase.list(`profile/${temp.user}/delivery/`).take(1).subscribe(snapshot =>{ 
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
            })//end snapshot delivery data
            this.navCtrl.push(SelectRunnerPage, {runner: temp.user});
            loader.dismiss();
            //push delivery list
	      	}
	      },{
	      	text:'Self-Delivery',
	      	role: 'self',
	      	handler: () => {
	        	console.log(custOrderID);
	          this.afDatabase.object(`profile/${this.uid}/list-order/${orderID}`).update({ status: '4', selfDelivery: '1' });
	          this.afDatabase.object(`profile/${customerID}/order/${custOrderID}`).update({ status: '4' });
            //push delivery list
					  let loader = this.loadingCtrl.create({
					  content: "Please wait...",
					  duration: 1000
					  });
					  loader.present();
            this.orderData = this.afDatabase.object(`profile/${customerID}/order/${custOrderID}`).take(1).subscribe(snapshot =>{
              this.paidStr == `${snapshot.paid}`; });

            this.delivery.orderID = custOrderID;
            this.delivery.custID = customerID;
            this.delivery.fdspID = this.uid;
            this.delivery.runnerID = this.uid;
            this.delivery.status = 0;
            if(this.paidStr == 'true')
            {
              this.delivery.paid = 1;
            }
            this.delivery.paid = 0;
            this.afDatabase.list(`profile/${this.uid}/delivery/`).push(this.delivery);
					  this.navCtrl.setRoot(this.navCtrl.getActive().component);	      		
	      	}	      	
	      },{
	        text: 'Cancel',
	        role: 'cancel',
	        handler: () => {
	          console.log('Cancel clicked');
	        }
	      }
	    ]
	  });
	  actionSheet.present();   		
  	}
  }
  // Convert Degress to Radians
  Deg2Rad(deg) {
    return deg * Math.PI / 180;
  }
  PythagorasEquirectangular(lat1, lon1, lat2, lon2) {
    lat1 = this.Deg2Rad(lat1);
    lat2 = this.Deg2Rad(lat2);
    lon1 = this.Deg2Rad(lon1);
    lon2 = this.Deg2Rad(lon2);
    var R = 999999; // km
    var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
    var y = (lat2 - lat1);
    var d = Math.sqrt(x * x + y * y) * R;
    return d;
  }
  /*nearestRunner(){
    var mindif = 99999;
    var closest;

    for (index = 0; index < runners.length; ++index) {
      var dif = PythagorasEquirectangular(latitude, longitude, cities[index][1], cities[index][2]);
      if (dif < mindif) {
        closest = index;
        mindif = dif;
      }
    } 
  }*/
  ionViewWillLoad(){
    this.afAuth.authState.take(1).subscribe(data => {
        this.uid = `${data.uid}`;
        this.profileData = this.afDatabase.object(`profile/${data.uid}`),
        this.getFDSP = this.afDatabase.object(`profile/${data.uid}`).take(1).subscribe(snapshot =>{
          this.fdspAddress = `${snapshot.locationFdsp}`;
          console.log(`${snapshot.locationFdsp}`);
          this.getFdspAddress = this.afDatabase.object(`profile/${data.uid}/location/${this.fdspAddress}`).take(1).subscribe(snapshot =>{
            this.fdspLng = parseFloat(`${snapshot.longitude}`);
            this.fdspLat = parseFloat(`${snapshot.latitude}`);
            console.log(`${snapshot.longitude}`, `${snapshot.locationFdsp}`);            
          })
        }),
        this.orders = this.afDatabase.list(`profile/${data.uid}/list-order/`).take(1).subscribe(snapshot =>{
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
        }),
        this.getData = this.afDatabase.list(`profile/`).take(1).subscribe(snapshot =>{//open snapshot profileDetails
          snapshot.forEach(data =>{//open data profileDetails
            if(`${data.runner}` == '1')
            {
              console.log(`${data.runner}`);
              this.runnerLocationID = `${data.runnerLocation}`;
              console.log(this.runnerLocationID,`${data.$key}`);
              this.getLocation = this.afDatabase.object(`profile/${data.$key}/location/${this.runnerLocationID}`).take(1).subscribe(snapshot =>{
                this.runnerLat = parseFloat(`${snapshot.latitude}`);
                this.runnerLng = parseFloat(`${snapshot.longitude}`);
                console.log(this.fdspLat, this.fdspLng, this.runnerLat, this.runnerLng);
                this.distance = this.calculateDistance(this.fdspLat, this.fdspLng, this.runnerLat, this.runnerLng);
                console.log(this.distance);
                if(this.distance < 25)
                {
                  if(`${data.$key}` != this.uid){
                    this.runners.push(snapshot);
                  }                  
                }
              })
            }
          });//end data profileDetails
        })//end snapshot profileDetails
       });
    console.log(this.runners);
  }
  calculateDistance(lat1:number,lat2:number,long1:number,long2:number){
      let p = 0.017453292519943295;    // Math.PI / 180
      let c = Math.cos;
      let a = 0.5 - c((lat1-lat2) * p) / 2 + c(lat2 * p) *c((lat1) * p) * (1 - c(((long1- long2) * p))) / 2;
      let dis = (12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
      return dis;
    }
}
