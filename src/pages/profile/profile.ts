import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ActionSheetController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { Observable } from 'rxjs/Observable';
import { storage } from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Subscription } from 'rxjs/Subscription';
import firebase from 'firebase';

import { Profile } from '../../models/profile';
import { Menu } from "../../models/menu";
import { Order } from "../../models/order";

import { MenuDescPage } from '../menu-desc/menu-desc';
import { OrderListPage } from '../order-list/order-list';
import { AddMenuPage } from '../add-menu/add-menu';
import { MenuPage } from '../menu/menu';
import { SettingPage } from '../setting/setting';
import { ManageDeliveryPage } from '../manage-delivery/manage-delivery';
/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  menus: Observable<any[]>;
  profileData: Observable<any[]>;
  fdsps: Observable<any[]>;
  runners: Subscription;
  orders: Observable<any[]>;
  fdsp: boolean = false;
  runner: boolean = false;
  public myPhotosRef: any;
  public myPhoto: any;
  public myPhotoURL: any;
  uid: string;
  constructor(
    public loadingCtrl: LoadingController, 
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController, 
    private afDatabase: AngularFireDatabase, 
    private afAuth: AngularFireAuth, 
    public navCtrl: NavController, 
    public navParams: NavParams,
    private camera: Camera
    ) 
  {
    this.myPhotosRef = firebase.storage().ref('/Profile/');
  }
  setting(){
    this.navCtrl.push(SettingPage);
  }
  changeImage(){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Change your Profile Picture',
      buttons: [
        {
          text: 'Take Photo',
          role: 'take',
          handler: () => {
            this.takePhoto();
          }
        },{
          text: 'Upload Image',
          role: 'upload',
          handler: () => {
            this.uploadImage();
          }
        },{
          text: 'View Image',
          role: 'view',
          handler: () => {
            this.viewImage();
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
  viewImage(){

  }
  uploadImage(){
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      quality: 100,
      encodingType: this.camera.EncodingType.PNG,
    }).then(imageData => {
      this.myPhoto = imageData;
      this.uploadPhoto();
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }
  takePhoto(){
    this.camera.getPicture({
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.PNG,
      saveToPhotoAlbum: true
    }).then(imageData => {
      this.myPhoto = imageData;
      this.uploadPhoto();
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }
  
  private uploadPhoto(): void {
    this.myPhotosRef.child(this.generateUUID()).child('myPhoto.png')
      .putString(this.myPhoto, 'base64', { contentType: 'image/png' })
      .then((savedPicture) => {
        this.myPhotoURL = savedPicture.downloadURL;
        this.afDatabase.object(`profile/${this.uid}`).update({photoURL: this.myPhotoURL});
      });

  }
 
  private generateUUID(): any {
    return this.uid;
  }
  foodDel(){
    let loader = this.loadingCtrl.create({
    content: "Please wait...",
    duration: 1000
    });
    loader.present();
    this.navCtrl.push(MenuPage);
  }
  manageDelivery(){
     let loader = this.loadingCtrl.create({
    content: "Please wait...",
    duration: 1000
    });
    loader.present();
    this.navCtrl.push(ManageDeliveryPage);   
  }
  logout(){ 
    let loader = this.loadingCtrl.create({
    content: "Please wait...",
    duration: 1000
    });
    loader.present();
    this.afAuth.auth.signOut().then(function() { 
      // Sign-out successful.
    }, function(error) {
      // An error happened.
    });

    this.navCtrl.setRoot("LoginPage");
  }

  ionViewWillLoad(){
    this.afAuth.authState.take(1).subscribe(data => {
        this.profileData = this.afDatabase.object(`profile/${data.uid}`),
        this.runners = this.afDatabase.object(`profile/${data.uid}/`).take(1).subscribe(snapshot =>{
          if(`${snapshot.runner}` == '1')
          {
            this.runner = true;
          }
          if(`${snapshot.fdsp}` == '1')
          {
            this.fdsp = true;
          }
        }),
        
        this.uid = `${data.uid}`
    });
  }
}
