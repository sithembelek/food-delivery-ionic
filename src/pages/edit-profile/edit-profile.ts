import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { Observable } from 'rxjs/Observable';

import { User} from "../../models/user";
import { Profile} from "../../models/profile";

/**
 * Generated class for the EditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

	profileData: Observable<any[]>;
	users: Observable<any[]>;

	user = {} as User;
	profile = {} as Profile;
	email: string;
	password: string;
  gender: string;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
    private afDatabase: AngularFireDatabase, 
    private changeDetector: ChangeDetectorRef,
    private afAuth: AngularFireAuth  	
  	) {
  }
  ngAfterViewChecked(){
    this.changeDetector.detectChanges();
  }
  update(profile: Profile)
  {
  }
  ionViewDidLoad() {
    this.afAuth.authState.take(1).subscribe(data => {
        this.profileData = this.afDatabase.object(`profile/${data.uid}`)
    });
  }

}
