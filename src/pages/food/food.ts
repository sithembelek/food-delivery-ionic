import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, NavParams, ToastController, AlertController, Events  } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Menu } from '../../models/menu';
import { Profile } from '../../models/profile';
import { Order } from '../../models/order';
import { LoginPage } from '../login/login';
import { MakeOrderPage } from '../make-order/make-order';
import { CartPage } from '../cart/cart';
import { Favourite } from '../../models/favourite';
/**
 * Generated class for the FoodPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-food',
  templateUrl: 'food.html',
})
export class FoodPage {

	menuID: string;
  menus: Observable<any[]>;
  profileData: Observable<any[]>;
  orders: Observable<any[]>;
  profileDetails: Subscription;
  menu: Subscription;
  fdsp:string;
  quantity: number;
  totalPrice: number = 0;
  price: any;
  preOrder:boolean=false;
  order = {} as Order;
  menuprice: any;
  menuPhotoURL: any;
  menuname: any;
  fav = {} as Favourite;
  getFavData: Subscription;
  favCheck: boolean = false;
  favID: string;
  uid: string;
  deleteFav: FirebaseObjectObservable<any>;

  constructor(private geolocation : Geolocation,
    private afAuth: AngularFireAuth, 
  	private afDatabase: AngularFireDatabase, 
  	public navParams: NavParams, 
  	private toast: ToastController,
  	public navCtrl: NavController,
  	public alertCtrl: AlertController,
  	public events: Events,
    public loadingCtrl: LoadingController) {
  	this.menuID = this.navParams.get('key');
  	this.fdsp = this.navParams.get('fdspKey');
  	this.quantity = 0;

  }
	private increment () {
	  if(this.quantity != 10)
	  {
	  	this.quantity++;
	  	this.totalPrice = this.price*this.quantity;
	  }
	}

	private decrement () {
		if(this.quantity != 0)
		{
			this.quantity--;
			this.totalPrice = this.price*this.quantity;
		}	  
	}
	makeOrder(){
		if(this.quantity == 0)
		{
	    let alert = this.alertCtrl.create({
	      title: 'Error Add To Cart',
	      subTitle: 'Please specify quantity',
	      buttons: ['OK']
	    });
	    alert.present();			
		}
		else
		{
			let loader = this.loadingCtrl.create({
	  			content: "Add menu to cart...",
	  			duration: 3000
			});
			loader.present();
			this.order.menu = this.menuID;
			this.order.quantity=this.quantity;
			this.order.totalPrice=this.totalPrice;
			//this.order.location=this.location;  //user should submit the location
			this.order.fdsp = this.fdsp;
			this.order.menuPhoto = this.menuPhotoURL;
			this.order.menuName = this.menuname;
			this.order.menuPrice = this.menuprice;
			this.order.status=0;
			this.order.orderDate = new Date().toISOString();
	    this.afAuth.authState.take(1).subscribe(data => {
	      this.afDatabase.list(`profile/${data.uid}/order/`).push(this.order);
	      });			
		}
	}
	goCart(){
		this.navCtrl.push(CartPage);
	}
	selectQuantity(q)
	{
		this.quantity = q;
		this.totalPrice = this.price*this.quantity;
	}
	checkFav(): boolean{
    this.getFavData = this.afDatabase.list(`profile/${this.uid}/favourite/`).take(1).subscribe(snapshot =>{
    	snapshot.forEach(data =>{
    		if(`${data.menuID}` == this.menuID)
    		{
    			return true;
    		}
    		else{
    			return false;
    		}
    	})
    });
    return false;
	}
  setFav(){
  	console.log(this.favID);
  	console.log(this.favCheck);
  	if(this.favCheck == true)
  	{
      let loader = this.loadingCtrl.create({
      content: "Unfavourite Menu...",
      duration: 1000
      });
      loader.present();
  		this.deleteFav = this.afDatabase.object(`profile/${this.uid}/favourite/${this.favID}`);
  		this.deleteFav.remove();
  		this.favCheck = false;
  		loader.dismiss();
  	}
  	else{
	    this.fav.menuID = this.menuID;
      let loader = this.loadingCtrl.create({
      content: "Favouriting Menu...",
      duration: 1000
      });
      loader.present();
	    this.afDatabase.list(`profile/${this.uid}/favourite/`).push(this.fav);  
	    this.favCheck = true;		
	    loader.dismiss();
  	}
		this.navCtrl.pop();
  }
  ionViewDidLoad() {
  	this.afAuth.authState.take(1).subscribe(data => {
  		this.uid = `${data.uid}`;
  		this.profileData = this.afDatabase.object(`profile/${data.uid}`),
      this.menus = this.afDatabase.object(`profile/${this.fdsp}/menu-list/${this.menuID}`),
      this.menu = this.afDatabase.object(`profile/${this.fdsp}/menu-list/${this.menuID}`).take(1).subscribe(snapshot =>{
      	this.price=`${snapshot.menuPrice}`;
      	this.menuPhotoURL = `${snapshot.photoURL}`;
      	this.menuname = `${snapshot.menuName}`;
      	this.menuprice = `${snapshot.menuPrice}`;
      	if(`${snapshot.preOrder}` == '1')
      	{
      		this.preOrder=true;
      	}
      	else
      	{
      		this.preOrder=false;
      	}
      })
      this.getFavData = this.afDatabase.list(`profile/${data.uid}/favourite/`).take(1).subscribe(snapshot =>{
      	snapshot.forEach(data =>{
      		if(`${data.menuID}` == this.menuID)
      		{
      			this.favID = `${data.$key}`;
      			this.favCheck = true;
      		}
      		else{
      			this.favCheck = false;
      		}
      	})
      })
  	});
  }
}
