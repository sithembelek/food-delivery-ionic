import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ActionSheetController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { Observable } from 'rxjs/Observable';
import { storage } from 'firebase';
import { Subscription } from 'rxjs/Subscription';

import { Profile } from '../../models/profile';
import { SelectMapPage } from '../select-map/select-map';
import { SettingPage } from '../setting/setting';
import { PositionModel } from '../../models/position.model';
/**
 * Generated class for the RunnerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-runner',
  templateUrl: 'runner.html',
})
export class RunnerPage {

  profileData: Observable<any[]>;
  runners: Subscription;
  trueRunner: boolean = false;
  falseRunner: boolean = false;
  locationName: string="";
  model: string="";
  colourVehicle: string="";
  plateNumber: string="";
  uid: string;
  locationID: string
  readLocation: Subscription;
  runner: number;
  loc: Subscription;
  locData: PositionModel[] = [];
  location: string;
  locationAddress: string;
  constructor(
    public loadingCtrl: LoadingController, 
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController, 
    private afDatabase: AngularFireDatabase, 
    private afAuth: AngularFireAuth, 
    public navCtrl: NavController, 
    public navParams: NavParams) {
  }
  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Register as Runner?',
      message: 'Are you sure you want to become part of the Runner Team of EATEE?',
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
            this.afDatabase.object(`profile/${this.uid}`).update({runner: '1'});
          }
        }
      ]
    });
    confirm.present();
  }
  openMap(){
    this.navCtrl.push(SelectMapPage, {key: "runner"});
  }
  startRunner(model, colourVehicle, plateNumber){
    let loader = this.loadingCtrl.create({
    content: "Start Runner...",
    duration: 3000
    });
    loader.present();
    this.model = model.toUpperCase();
    this.colourVehicle = colourVehicle.toUpperCase();
    this.plateNumber = plateNumber.toUpperCase();
    this.afDatabase.object(`profile/${this.uid}`).update({vehicle: this.model, vehicleColour: this.colourVehicle, plateNumber: this.plateNumber});
    this.navCtrl.setRoot(SettingPage);
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
  powerOff(){
      let loader = this.loadingCtrl.create({
      content: "Stop Being a Runner...",
      duration: 3000
      });
      loader.present();
      this.afDatabase.object(`profile/${this.uid}`).update({runner: '0', vehicle: '', vehicleColour: '', plateNumber: '', runnerLocation: ''});
      this.navCtrl.setRoot(SettingPage);
  }
  ionViewDidLoad() {
    this.afAuth.authState.take(1).subscribe(data => {
      this.uid = `${data.uid}`;
      this.profileData = this.afDatabase.object(`profile/${data.uid}`),
      this.runners = this.afDatabase.object(`profile/${data.uid}/`).take(1).subscribe(snapshot =>{
        if(`${snapshot.runner}` == '0')
        {
          this.trueRunner = false;
          this.runner = parseInt(`${snapshot.runner}`);
          this.showConfirm();
        }
        else if(`${snapshot.runner}` == '1')
        {
          this.trueRunner = true;
          this.runner = parseInt(`${snapshot.runner}`);
          this.model = `${snapshot.vehicle}`;
          this.colourVehicle = `${snapshot.vehicleColour}`;
          this.plateNumber = `${snapshot.plateNumber}`;
        }
          this.locationID = `${snapshot.runnerLocation}`;
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
  }
}