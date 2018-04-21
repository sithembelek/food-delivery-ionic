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

import { CartPage } from '../cart/cart';
import { FdspPage } from '../fdsp/fdsp';
import { RunnerPage } from '../runner/runner';
import { ViewAddressPage } from '../view-address/view-address';
import { PositionModel } from '../../models/position.model';

declare var google: any;
var infoWindow: any;

@IonicPage()
@Component({
  selector: 'page-select-map',
  templateUrl: 'select-map.html',
})
export class SelectMapPage implements OnInit{
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
  profileData: Observable<any[]>;
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

  acService: any = new google.maps.places.AutocompleteService();        
  autocompleteItems: any = [];
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
  ){
      this.geocoder = new google.maps.Geocoder;
  		this.pageKey = this.navParams.get('key');
      this.address = this.navParams.get('address');
  }

  updateSearchResults() {
    if (this.autocomplete.query == '') {
        this.autocompleteItems = [];
        return;
    }
    let self = this;
    let config = { 
        types:  ['geocode'], // other types available in the API: 'establishment', 'regions', and 'cities'
        input: this.autocomplete.query, 
        componentRestrictions: { country: 'MY' } 
    }
    this.acService.getPlacePredictions(config, function (predictions, status) {
        console.log('modal > getPlacePredictions > status > ', status);
        self.autocompleteItems = [];            
        predictions.forEach(function (prediction) {              
            self.autocompleteItems.push(prediction);
        });
    });
  }
  /*selectSearchResult(item){
    console.log(item);
    this.autocompleteItems = [];

    this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
      console.log(results);
      console.log(results[0]);
      if(status === 'OK' && results[0]){
            this.pos = {
                lat: parseFloat(results[0].geometry.location.lat()),
                lng: parseFloat(results[0].geometry.location.lng())
        };
        var latlng2 = {lat: parseFloat(results[0].geometry.location.lat()), lng: parseFloat(results[0].geometry.location.lng())};
        console.log(this.pos);
            let marker = new google.maps.Marker({
              position: results[0].geometry.location,
              map: this.map,
              draggable: true
            });
        this.map.setCenter(latlng2);
        }
    })
  }*/
  displayMap(){
    this.getUserPosition();
    this.location = new google.maps.LatLng(this.latitude, this.longitude);

    const map = new google.maps.Map(this.mapRef.nativeElement,{
      center: this.location,
      zoom: 18,
      streetViewControl: false,
      mapTypeId: 'roadmap'
    });

    console.log(this.mapRef.nativeElement);

    var marker = new google.maps.Marker({
        position: this.location,
        map: map,
        draggable: true
    });
    infoWindow = new google.maps.InfoWindow();
    var geocoder = new google.maps.Geocoder();
    var listener = google.maps.event.addListener(marker, 'dragend', function(evt){
      this.latitude = evt.latLng.lat();
      this.longitude = evt.latLng.lng();
      var latlng = {lat: parseFloat(this.latitude), lng: parseFloat(this.longitude)};
        geocoder.geocode({'location': latlng}, function(results, status) {
          if (status === 'OK') {
            if (results[0]) {
               marker = new google.maps.Marker({
                position: latlng,
                map: map,
                draggable: true
              });
              infoWindow.setContent(results[0].formatted_address);
              infoWindow.open(map, marker);
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
          });
        });
      //console.log('Current Latitude:',evt.latLng.lat(),'Current Longitude:',evt.latLng.lng(), evt);
      //this.latitude = evt.latLng.lat();
      //this.longitude = evt.latLng.lng();
      //this.Getaddress(this.latitude, this.longitude);
      console.log('this.address == ', this.address);
      console.log('lotitude: ', this.latitude, 'longitude: ', this.longitude);
  }
  ngOnInit() {
    this.acService = new google.maps.places.AutocompleteService();        
    this.autocompleteItems = [];
    this.autocomplete = {
        query: ''
    };        
  }
  sendLocation(){
  	console.log(this.pageKey);
  	if(this.pageKey == "cart")
  	{
	    let prompt = this.alertCtrl.create({
	      title: this.address,
	      message: "Save this address as ",
	      inputs: [
	        {
	          name: 'name',
	          placeholder: 'Name'
	        },
	      ],
	      buttons: [
	        {
	          text: 'Cancel',
	          handler: data => {
	            console.log('Cancel clicked');
	          }
	        },
	        {
	          text: 'Save',
	          handler: data => {
	            this.locationName = data.name.toUpperCase();
	            this.qwertyuiop.name = this.locationName;
	            this.qwertyuiop.latitude = this.latitude;
	            this.qwertyuiop.longitude = this.longitude;
              this.qwertyuiop.user = this.uid;
              this.qwertyuiop.address = this.address;
	            console.log(this.address);
	            //this.qwertyuiop.address = this.address;
	            this.afDatabase.list(`profile/${this.uid}/location/`).push(this.qwertyuiop);
	            this.navCtrl.push(CartPage, {locationName: this.locationName, key: this.qwertyuiop.$key});
	          }
	        }
	      ]
	    });
	    prompt.present();
  		
  	}
    else if(this.pageKey == "fdsp")
    {
      let prompt = this.alertCtrl.create({
        title: this.address,
        message: "Save this address as ",
        inputs: [
          {
            name: 'name',
            placeholder: 'Name'
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Save',
            handler: data => {
              this.locationName = data.name.toUpperCase();
              this.qwertyuiop.name = this.locationName;
              this.qwertyuiop.latitude = this.latitude;
              this.qwertyuiop.longitude = this.longitude;
              this.random = Math.floor(Math.random() * Math.floor(999999999999999)+1);
              this.qwertyuiop.randomNumber = this.random;
              this.qwertyuiop.user = this.uid;
              this.qwertyuiop.address = this.address;
              console.log(this.address);
              //this.qwertyuiop.address = this.address;
              this.afDatabase.list(`profile/${this.uid}/location/`).push(this.qwertyuiop);
              this.getNewLocation = this.afDatabase.list(`profile/${this.uid}/location/`).take(1).subscribe(snapshot =>{
                snapshot.forEach(data =>{
                  if(parseInt(`${data.randomNumber}`) == this.random)
                  {
                    this.locationID = `${data.$key}`;
                    this.afDatabase.object(`profile/${this.uid}`).update({locationFdsp: this.locationID});
                  }
                })
              })
              this.navCtrl.push(FdspPage, {locationName: this.locationName});
            }
          }
        ]
      });
      prompt.present();
    }
    else if(this.pageKey == "runner")
    {
      let prompt = this.alertCtrl.create({
        title: this.address,
        message: "Save this address as ",
        inputs: [
          {
            name: 'name',
            placeholder: 'Name'
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Save',
            handler: data => {
              this.locationName = data.name.toUpperCase();
              this.qwertyuiop.name = this.locationName;
              this.qwertyuiop.latitude = this.latitude;
              this.qwertyuiop.longitude = this.longitude;
              this.random = Math.floor(Math.random() * Math.floor(999999999999999)+1);
              this.qwertyuiop.randomNumber = this.random;
              this.qwertyuiop.user = this.uid;
              this.qwertyuiop.address = this.address;
              console.log(this.address);
              //this.qwertyuiop.address = this.address;
              this.afDatabase.list(`profile/${this.uid}/location/`).push(this.qwertyuiop);
              this.getNewLocation = this.afDatabase.list(`profile/${this.uid}/location/`).take(1).subscribe(snapshot =>{
                snapshot.forEach(data =>{
                  if(parseInt(`${data.randomNumber}`) == this.random)
                  {
                    this.locationID = `${data.$key}`;
                    this.afDatabase.object(`profile/${this.uid}`).update({runnerLocation: this.locationID});
                  }
                })
              })
              this.navCtrl.push(RunnerPage, {locationName: this.locationName});
            }
          }
        ]
      });
      prompt.present();      
    }
    else if(this.pageKey == "viewAddress"){
      let prompt = this.alertCtrl.create({
        title: this.address,
        message: "Save this address as ",
        inputs: [
          {
            name: 'name',
            placeholder: 'Name'
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Save',
            handler: data => {
              this.locationName = data.name.toUpperCase();
              this.qwertyuiop.name = this.locationName;
              this.qwertyuiop.latitude = this.latitude;
              this.qwertyuiop.longitude = this.longitude;
              this.qwertyuiop.user = this.uid;
              this.qwertyuiop.address = this.address;
              console.log(this.address);
              //this.qwertyuiop.address = this.address;
              this.afDatabase.list(`profile/${this.uid}/location/`).push(this.qwertyuiop);
              this.navCtrl.push(ViewAddressPage);
            }
          }
        ]
      });
      prompt.present();      
    }
  }
  ionViewDidLoad() {
    this.getUserPosition();
    this.displayMap();
    this.afAuth.authState.take(1).subscribe(data => {
    		this.uid = `${data.uid}`;
        this.profileData = this.afDatabase.object(`profile/${data.uid}`)
        console.log(this.profileData);
      });
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
