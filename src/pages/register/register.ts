import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ActionSheetController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { Observable } from 'rxjs/Observable';
import { storage } from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Subscription } from 'rxjs/Subscription';
import firebase from 'firebase';

import { User} from "../../models/user";
import { Profile} from "../../models/profile";
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
	user = {} as User;
  profile = {} as Profile;
  profileData: Observable<any[]>;
  public myPhotosRef: any;
  public myPhoto: any;
  public myPhotoURL: any;
  uid: string;
  gender: string;

  constructor(
    public loadingCtrl: LoadingController, 
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController, 
    private afDatabase: AngularFireDatabase, 
    private afAuth: AngularFireAuth, 
    public navCtrl: NavController, 
    public navParams: NavParams,
    private camera: Camera
    ) {
    this.myPhotosRef = firebase.storage().ref('/Profile/');
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

  setGender(gender: string){
    this.gender = gender;
  }
  async register(user: User, profile: Profile){
		let loader = this.loadingCtrl.create({
  	content: "Please wait...",
  	duration: 3000
		});
		loader.present();
    profile.gender = this.gender;
    profile.photoURL = this.myPhotoURL;
    profile.defaultAddress = "";
    profile.runner = 0;
    profile.fdsp = 0;
  	try{
  		const result = await this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password);
      if(result){
        this.afAuth.authState.take(1).subscribe(auth => {
          this.afDatabase.object(`profile/${auth.uid}`).set(this.profile)  });
      } //end of if
      } //end of try
  	catch(e){
      let alert = this.alertCtrl.create({
        title: 'Sign Up Error',
        subTitle: 'Please ensure tha',
        buttons: ['OK']
      });
      alert.present();
  	} //end of catch
  	
  }

}
