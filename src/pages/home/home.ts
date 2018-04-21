import { Component, ViewChild, ElementRef, OnInit  } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions, CameraPosition, MarkerOptions, Marker } from '@ionic-native/google-maps';
import { AngularFireAuth } from 'angularfire2/auth';
import { Camera } from '@ionic-native/camera';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation';

import { LoginPage } from '../login/login';
import { FoodTypePage } from '../food-type/food-type';
import { CartPage } from '../cart/cart';
declare var google: any;

@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{
  @ViewChild('map') mapRef:ElementRef;

  options : GeolocationOptions;
  currentPos : Geoposition;
  userPosition: any;
  latitude: any = '1.5587578';
  longitude: any = '103.6465376';
  autocompleteService: any;
  placesService: any;
  //map: GoogleMap;
  profileData: Observable<any[]>;
  places: any = [];
  autocompleteItems: any;
  autocomplete: any = {
      query: ''
    };
  acService:any;

  constructor(
    private afAuth: AngularFireAuth, 
    private geolocation : Geolocation,
    public loadingCtrl: LoadingController,
    private afDatabase: AngularFireDatabase, 
    public navCtrl: NavController
    ) { }
  goCart(){
    this.navCtrl.push(CartPage);
  }
  displayMap(){
    this.getUserPosition();
    const location = new google.maps.LatLng(this.latitude, this.longitude);

    const options = {
      center: location,
      zoom: 15,
      streetViewControl: false,
      mapTypeId: 'roadmap'
    };

    const map = new google.maps.Map(this.mapRef.nativeElement,options);
    console.log(this.mapRef.nativeElement);

    var marker = new google.maps.Marker({
        position: location,
        map
    });
  }
  ionViewDidLoad() {
    this.getUserPosition();
    this.displayMap();
    this.afAuth.authState.take(1).subscribe(data => {
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
  ngOnInit() {
      this.acService = new google.maps.places.AutocompleteService();        
      this.autocompleteItems = [];
      this.autocomplete = {
          query: ''
      };        
    }

    chooseItem(item: any) {
        console.log('modal > chooseItem > item > ', item);
        this.navCtrl.push(FoodTypePage,{location:item.description, locationID:item.id});
    }
    updateSearch() {
        console.log('modal > updateSearch');
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

  }