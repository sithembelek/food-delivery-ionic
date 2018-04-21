import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, ActionSheetController, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { Camera, CameraOptions } from '@ionic-native/camera';
import firebase from 'firebase';
import { Subscription } from 'rxjs/Subscription';

import { Menu } from '../../models/menu';
import { Profile } from '../../models/profile';
import { Order } from '../../models/order';
import { MenuPage } from '../menu/menu';

//import { MenuListService } from '../../services/menu.service';
/**
 * Generated class for the AddMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-menu',
  templateUrl: 'add-menu.html',
})
export class AddMenuPage {

  menu = {} as Menu;
  menus: Observable<any[]>;
  profileData: Observable<any[]>;
  orders: Observable<any[]>;
  uid: string = "";
  public myPhotosRef: any;
  public myPhoto: any;
  public myPhotoURL: any;
  imageInserted: boolean = false;
  preOrder: boolean = false;
  pre: boolean = false;
  uname: string = "";
  uphoto: string = "";
  profileDetails: Subscription;

  constructor(
    private camera: Camera,
    public actionSheetCtrl: ActionSheetController,
    private afAuth: AngularFireAuth, 
    private afDatabase: AngularFireDatabase,  
    public navCtrl: NavController, 
    public navParams: NavParams,
    private changeDetector: ChangeDetectorRef,
    ) {
    this.myPhotosRef = firebase.storage().ref(`/menu/${this.uid}`);
    this.menu.preOrder=0;
  }
  ngAfterViewChecked(){
    this.changeDetector.detectChanges();
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
      });
       this.imageInserted = true;
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
  startpreOrder(){
    this.pre = true;
    this.menu.preOrder=1;
    if(this.preOrder == false){
      this.menu.preOrder=0;
      this.pre = false;
    }    
  }
  addMenu(menu){
    if(menu.date == null)
    {
      menu.status="Inactive";
    }
    menu.status="Active";
    menu.fdsp = this.uname;
    menu.fdspPhoto = this.uphoto;
    menu.photoURL = this.myPhotoURL;
    this.afAuth.authState.take(1).subscribe(data => {
      this.afDatabase.list(`profile/${data.uid}/menu-list/`).push(this.menu)
        .then(() => this.navCtrl.setRoot(MenuPage));
      });
  }
  ionViewWillLoad(){
    this.afAuth.authState.take(1).subscribe(data => {
        this.profileData = this.afDatabase.object(`profile/${data.uid}`)
        this.uid = `${data.uid}`;
        this.profileDetails = this.afDatabase.object(`profile/${data.uid}`).take(1).subscribe(snapshot => {
          this.uname = `${snapshot.name}`;
          this.uphoto = `${snapshot.photoURL}`;          
        })

    });
  }
}
