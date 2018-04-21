import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController, NavParams, ViewController, ActionSheetController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { Subscription } from 'rxjs/Subscription';
import { Camera, CameraOptions } from '@ionic-native/camera';
import firebase from 'firebase';

import { MenuPage } from '../menu/menu';
import { EditMenuPage } from '../edit-menu/edit-menu';
import { Profile } from '../../models/profile';
import { Menu } from '../../models/menu';
import { Order } from '../../models/order';

/**
 * Generated class for the MenuDescPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menu-desc',
  templateUrl: 'menu-desc.html',
})
export class MenuDescPage {

	menuID: string;
	menu = {} as Menu;
  deli: boolean;
  cats: string;
  edited: boolean;
  hide: boolean;
  uid: string = "" ;
  menus: Observable<any[]>;
  menuData: Subscription;
  profileData: Observable<any[]>;
  orders: Observable<any[]>;
  displayName: boolean;
  pre:boolean;
  preOrder:boolean;
  date:any = "";
  time:any = "";
  public myPhotosRef: any;
  public myPhoto: any;
  public myPhotoURL: any;
  photoMenu: any;
  updateMenus: FirebaseObjectObservable<any[]>;

  constructor(
    private camera: Camera,
    public actionSheetCtrl: ActionSheetController,
  	public navCtrl: NavController,
  	 public navParams: NavParams,
  	 public viewCtrl: ViewController,
  	 private afAuth: AngularFireAuth,
  	 private afDatabase: AngularFireDatabase,
  	 public alertCtrl: AlertController,
  	 private changeDetector: ChangeDetectorRef,
  	 public loadingCtrl: LoadingController
  	 ) 
  {
    this.deli = false;
    this.edited = false;
    this.hide = false;
    this.displayName=true;
    this.pre=false;
    this.preOrder=false;
  	this.menuID = this.navParams.get('key');
    this.myPhotosRef = firebase.storage().ref(`/menu/${this.uid}`);
  }
  ngAfterViewChecked(){
    this.changeDetector.detectChanges();
  }
  startDelivery() {
    if(this.deli == false){
      this.edited = false;
      this.afDatabase.object(`profile/${this.uid}/menu-list/${this.menuID}`).update({ status: 'Inactive' });
    }
    else{
      this.edited = true;
      this.afDatabase.object(`profile/${this.uid}/menu-list/${this.menuID}`).update({ status: 'Active' });
    }
  }
  startpreOrder(){
    this.pre = true;
    this.menu.preOrder = 1;
    if(this.preOrder == false){
      this.menu.preOrder = 0;
      this.pre = false;
    }  
  }
  editMenu(menu){
    this.menu.date = this.date;
    this.menu.time = this.time;
    this.afDatabase.object(`profile/${this.uid}/menu-list/${this.menuID}`).update(menu).then(() => this.navCtrl.setRoot(MenuPage));
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
    this.myPhotosRef.child(this.uid).child(this.generateUUID()).child('myPhoto.png')
      .putString(this.myPhoto, 'base64', { contentType: 'image/png' })
      .then((savedPicture) => {
        this.myPhotoURL = savedPicture.downloadURL;
        this.afDatabase.object(`profile/${this.uid}/menu-list/${this.menuID}`).update({ photoURL: `${this.myPhotoURL}` });
        this.photoMenu = this.myPhotoURL;
      });
  }
  private generateUUID(): any {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }
  ionViewWillLoad(){
    this.afAuth.authState.take(1).subscribe(data => {
        this.profileData = this.afDatabase.object(`profile/${data.uid}`),
        this.menus = this.afDatabase.object(`profile/${data.uid}/menu-list/${this.menuID}`),
        this.afDatabase.object(`profile/${data.uid}/menu-list/${this.menuID}/`).take(1).subscribe(snapshot =>{
          this.photoMenu = `${snapshot.photoURL}`;
          if(`${snapshot.status}` == 'Active')
          {
            this.deli = true;
            this.edited = true;
          }
          else
          {
            this.deli = false;
          }
          if(`${snapshot.preOrder}` == '1')
          {
            this.pre = true;
            this.preOrder = true;
            this.date = `${snapshot.date}`;
            this.time = `${snapshot.time}`;
          }
          else
          {
            this.pre=false;
          }
          console.log(`${snapshot.status}`);
        })
        this.uid=`${data.uid}`;
    });  
  }
}
