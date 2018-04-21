import { Component, ViewChild, ElementRef, OnInit, NgZone  } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions, CameraPosition, MarkerOptions, Marker } from '@ionic-native/google-maps';
import { AngularFireAuth } from 'angularfire2/auth';
import { Camera } from '@ionic-native/camera';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { Subscription } from 'rxjs/Subscription';

import { PositionModel } from '../../models/position.model';
/**
 * Generated class for the SelectRunnerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var google: any;
@IonicPage()
@Component({
  selector: 'page-select-runner',
  templateUrl: 'select-runner.html',
})
export class SelectRunnerPage {
	@ViewChild('map') mapRef:ElementRef;
  map: any;
  geocoder: any;
  markers = [];
  mapOpt = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
  };
  pos = {lat: 0, lng: 0};
  options : GeolocationOptions;
  currentPos : Geoposition;
  userPosition: any;
  latitude: any = '1.5587578';
  longitude: any = '103.6465376';
  autocompleteService: any;
  placesService: any;
  public address: string;
  pageKey: string;
  locationName: string;
  uid: string;
  qwertyuiop = {} as PositionModel;
  getNewLocation: Subscription;
  random: number;
  locationID: string;
  autocomplete: any = {
      query: ''
  }; 
  tempData: Observable<any[]>;
  location: any;
	runnerID:string;
	profileData: Observable<any[]>;
  constructor(
    private afAuth: AngularFireAuth,
    private alertCtrl: AlertController, 
    private geolocation : Geolocation,
    private afDatabase: AngularFireDatabase, 
    public loadingCtrl: LoadingController,
    private ngZone: NgZone,
    public navCtrl: NavController,
    public navParams: NavParams,
    private nativeGeocoder: NativeGeocoder
  	) {
  	this.runnerID = this.navParams.get('runner');
  }

  ionViewDidLoad() {
  	this.displayMap();
  	this.profileData = this.afDatabase.object(`profile/${this.runnerID}`);
  }
  displayMap(){
    this.getUserPosition();
    this.location = new google.maps.LatLng(this.latitude, this.longitude);

    const map = new google.maps.Map(this.mapRef.nativeElement,{
      center: this.location,
      zoom: 18,
      streetViewControl: false,
      mapTypeId: 'roadmap'
    });
    var marker = new google.maps.Marker({
        position: this.location,
        map: map,
        draggable: true
    });
    console.log(this.mapRef.nativeElement);
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

        console.log(this.latitude);
        console.log(this.longitude);    
        console.log(pos);

    },(err : PositionError)=>{
        console.log("error : " + err.message);
    });
  }
}
