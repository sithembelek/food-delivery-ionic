import { Component } from '@angular/core';
import { IonicPage, AlertController, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { Observable } from 'rxjs/Observable';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { RegisterPage } from '../register/register';
import { TabsPage } from '../tabs/tabs';
import { User} from "../../models/user";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

	user = {} as User;
  profileData: Observable<any[]>;
  public registerForm;
  public validation_messages;

  constructor(
    public alertCtrl: AlertController, 
    public loadingCtrl: LoadingController, 
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private afAuth: AngularFireAuth,
    private afDatabase: AngularFireDatabase,
    public formBuilder: FormBuilder
    ) {
    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    this.registerForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEXP)])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    }); 
    this.validation_messages = {
    'email': [
        { type: 'required', message: 'Email is required.' },
        { type: 'pattern', message: 'You entered a wrong email' }
      ]
    }
  }

  async login(user: User){
		let loader = this.loadingCtrl.create({
  	content: "Please wait...",
  	duration: 3000
		});
		loader.present();
  	try{
  		const result = await this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
  		if(result){
          this.navCtrl.setRoot(TabsPage);
        }
  		}
  	catch(e){
	    let alert = this.alertCtrl.create({
	      title: 'Login Error',
	      subTitle: 'The email or password is incorrect',
	      buttons: ['OK']
	    });
	    alert.present();
  		console.error(e);
  	}
  }
  register(){ 
    this.navCtrl.push(RegisterPage);
  }
}
