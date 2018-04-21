import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { Observable } from 'rxjs/Observable';

import { User} from "../../models/user";
import { Profile} from "../../models/profile";

import { EditUserPage } from '../edit-user/edit-user';
import { ViewAddressPage } from '../view-address/view-address';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { FdspPage } from '../fdsp/fdsp';
import { RunnerPage } from '../runner/runner';

/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
	profileData: Observable<any[]>;
	users: Observable<any[]>;

	user = {} as User;
	profile = {} as Profile;
	email: string;
	password: string;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
    private afDatabase: AngularFireDatabase, 
    private changeDetector: ChangeDetectorRef,
    private afAuth: AngularFireAuth,
    public loadingCtrl: LoadingController
  	) {
  }
  editUser(){
    let loader = this.loadingCtrl.create({
    content: "Please wait...",
    duration: 1000
    });
    loader.present();
  	this.navCtrl.push(EditUserPage);
  }
  editProfile(){
    let loader = this.loadingCtrl.create({
    content: "Please wait...",
    duration: 1000
    });
    loader.present();
  	this.navCtrl.push(EditProfilePage);
  }
  viewAddress(){
    this.navCtrl.push(ViewAddressPage);
  }
  fdspSetting(){
  	this.navCtrl.push(FdspPage);
  }
  runnerSetting(){
  	this.navCtrl.push(RunnerPage);
  }
  ionViewDidLoad() {
    this.afAuth.authState.take(1).subscribe(data => {
        this.profileData = this.afDatabase.object(`profile/${data.uid}`),
        this.email = `${data.email}`,
        this.password = `${data.uid}`
    });
  }

}
