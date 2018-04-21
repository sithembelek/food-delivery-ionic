import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ActionSheetController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { Observable } from 'rxjs/Observable';
import { storage } from 'firebase';
import { Subscription } from 'rxjs/Subscription';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';

import { Profile } from '../../models/profile';
import { Fdsp } from '../../models/fdsp';
import { SettingPage } from '../setting/setting';
import { SelectMapPage } from '../select-map/select-map';
import { PositionModel } from '../../models/position.model';
/**
 * Generated class for the FdspPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fdsp',
  templateUrl: 'fdsp.html',
})
export class FdspPage {
  profileData: Observable<any[]>;
  profile: Observable<any[]>;
  fdsp = {} as Fdsp;
  runners: Subscription;
  trueFDSP: boolean = false;
  falseFDSP: boolean = false;
  location: string;
  delivery: number;
  key: string;
  places: any = [];
  autocompleteItems: any;
  autocomplete: any = {
      query: ''
    };
  latitude: any;
  longitude: any;
  options : GeolocationOptions;
  currentPos : Geoposition;
  userPosition: any;
  position: any;
  administrativeArea: any;
  trueKey: number;
  uid: string;
  locationName: string;
  locationID: string;
  readLocation: Subscription;
  checkDelivery: number;
  loc: Subscription;
  locData: PositionModel[] = [];
  locationAddress: string;
  constructor(
    public loadingCtrl: LoadingController, 
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController, 
    private afDatabase: AngularFireDatabase, 
    private afAuth: AngularFireAuth, 
    public navCtrl: NavController, 
    public navParams: NavParams,
    private changeDetector: ChangeDetectorRef,
    private geolocation : Geolocation,
    private nativeGeocoder: NativeGeocoder
  	) {

  }
  ngAfterViewChecked(){
    this.changeDetector.detectChanges();
  }
  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Register as Food Delivery Service Provider?',
      message: 'Are you sure you want to become part of the FDS Provider team of EATEE?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.navCtrl.pop();
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.afDatabase.object(`profile/${this.uid}`).update({fdsp: '1'});
          }
        }
      ]
    });
    confirm.present();
	}
	getValue(){
    this.afAuth.authState.take(1).subscribe(data => {
        this.runners = this.afDatabase.list(`profile/${data.uid}/fdspData/`).take(1).subscribe(snapshot =>{
        	//this.key = `${snapshot.$key}`;
        	console.log(`${snapshot.$key}`);
        })
    });
	}
	startFDSP(){
    this.navCtrl.setRoot(SettingPage);	
	}
  setDelivery(deliveryDetails: number){
    this.afDatabase.object(`profile/${this.uid}`).update({delivery: deliveryDetails});
  }
  ionViewDidLoad() {
    this.afAuth.authState.take(1).subscribe(data => {
      this.uid = `${data.uid}`;
      this.profileData = this.afDatabase.object(`profile/${data.uid}`),
      this.runners = this.afDatabase.object(`profile/${data.uid}/`).take(1).subscribe(snapshot =>{
        this.checkDelivery = parseInt(`${snapshot.delivery}`);
        if(`${snapshot.fdsp}` == '0')
        {
        	console.log(`${snapshot.fdsp}`);
          this.trueFDSP = false;
          this.showConfirm();
        }
        if(`${snapshot.fdsp}` == '1')
        {
        	console.log(`${snapshot.fdsp}`);
          this.trueFDSP = true;
          this.getValue();
        }
        this.locationID = `${snapshot.locationFdsp}`;
        console.log(this.locationID);
        this.readLocation = this.afDatabase.object(`profile/${data.uid}/location/${this.locationID}`).take(1).subscribe( snapshot =>{
          this.locationName = `${snapshot.name}`;
          this.locationAddress = `${snapshot.address}`;
          console.log(this.locationName);
        })
      }),
      this.loc = this.afDatabase.list(`profile/${data.uid}/location/`).take(1).subscribe(snapshot =>{
        snapshot.forEach(data =>{
          this.locData.push(data);
        })
      })
    });
    this.getUserPosition();
  }
  selectAddress(address){
    if(address == ""){
      this.locationAddress = address;
    }
    else if(address == "addAddress"){
      this.openMap();
    }
    else{
      
      this.locationAddress = address;
    }
  }
  openMap(){
    this.navCtrl.push(SelectMapPage, {key: "fdsp"});
  }
  powerOff(){
      let loader = this.loadingCtrl.create({
      content: "Stop Being a Food Delivery Service Provider...",
      duration: 3000
      });
      loader.present();
      this.afDatabase.object(`profile/${this.uid}`).update({fdsp: '0', delivery: '', locationFdsp: ''});
      this.navCtrl.setRoot(SettingPage);
  }
  getUserPosition(){
      this.options = {
          enableHighAccuracy : true
      };

      this.geolocation.getCurrentPosition(this.options).then((pos : Geoposition) => {

          this.currentPos = pos;
          console.log(pos); 
          this.latitude = pos.coords.latitude;
          this.longitude = pos.coords.longitude; 

          console.log('latitude ' + this.latitude);
          console.log('longitude ' + this.longitude);    
          console.log(pos);
      },(err : PositionError)=>{
          console.log("error : " + err.message);
      });
      console.log(this.administrativeArea);
  }
}
