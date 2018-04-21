import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { PositionModel } from "../../models/position.model";
import { SelectMapPage } from '../select-map/select-map';
import { SettingPage } from '../setting/setting';
/**
 * Generated class for the ViewAddressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-address',
  templateUrl: 'view-address.html',
})
export class ViewAddressPage {

	location: Observable<any[]>;
	deleteLoc: FirebaseObjectObservable<any>;
	uid: string;
	default: boolean=false;
	getData: Subscription;
	getLocData: Subscription;
	defaultID: string;
	defaultLoc: PositionModel[] = [];

  constructor(
  	public navCtrl: NavController,
    private afDatabase: AngularFireDatabase, 
    private afAuth: AngularFireAuth,
    public alertCtrl: AlertController, 
    public loadingCtrl: LoadingController, 
  	public navParams: NavParams) {
  	this.default = false;
  }

  ionViewDidLoad() {
    this.afAuth.authState.take(1).subscribe(data => {
    	this.uid = `${data.uid}`;
    	this.getData = this.afDatabase.object(`profile/${data.uid}`).take(1).subscribe( snapshot =>{
    		if(`${snapshot.defaultAddress}` == "")
    		{
    			this.default = false;
    		}
    		else{
    			this.defaultID = `${snapshot.defaultAddress}`;
    			this.default = true;
    		}
    	}),
    	this.getLocData = this.afDatabase.list(`profile/${data.uid}/location/`).take(1).subscribe(snapshot =>{
    		snapshot.forEach(data =>{
    			if(`${data.$key}` == this.defaultID)
    			{
    				this.defaultLoc.push(data);
    			}
    		})
    	})
      this.location = this.afDatabase.list(`profile/${data.uid}/location/`)
    });
  }
  setDefault(locID: string){
    let loader = this.loadingCtrl.create({
    content: "Set Default Address...",
    duration: 1000
    });
    loader.present();
  	this.afDatabase.object(`profile/${this.uid}`).update({defaultAddress: locID});
  	this.navCtrl.setRoot(SettingPage);
  	loader.dismiss();
  }
  addAddress(){
    let prompt = this.alertCtrl.create({
      title: 'Add new Address',
      message: "Enter your new address",
      inputs: [
        {
          name: 'address',
          placeholder: 'Address'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.navCtrl.push(SelectMapPage, {key: 'viewAddress', address: data.address});
          }
        }
      ]
    });
    prompt.present();
  	
  }
  deleteAddress(locID: string){
    this.deleteLoc = this.afDatabase.object(`profile/${this.uid}/location/${locID}`);
    let confirm = this.alertCtrl.create({
      title: 'Delete Address',
      message: 'Are you sure you want to delete this address?',
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
            content: "Deleting Address...",
            duration: 1000
            });
            loader.present();
            this.deleteLoc.remove();
            if(locID == this.defaultID){
            	this.afDatabase.object(`profile/${this.uid}`).update({defaultAddress: ""});
            }
            this.navCtrl.pop();
          }
        }
      ]
    });
    confirm.present();
  }
}
