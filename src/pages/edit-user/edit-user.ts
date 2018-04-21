import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { Observable } from 'rxjs/Observable';

import { User} from "../../models/user";
import { Profile} from "../../models/profile";

/**
 * Generated class for the EditUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-user',
  templateUrl: 'edit-user.html',
})
export class EditUserPage {

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
    private afAuth: AngularFireAuth  	
  	) {
  }
  ngAfterViewChecked(){
    this.changeDetector.detectChanges();
  }
  update(password)
  {
  	this.afAuth.auth.currentUser.updatePassword(password);
  }
  

  ionViewDidLoad() {
    this.afAuth.authState.take(1).subscribe(data => {
        this.profileData = this.afDatabase.object(`profile/${data.uid}`),
        this.email = `${data.email}`,
        this.password = `${data.uid}`
    });
  }
}
