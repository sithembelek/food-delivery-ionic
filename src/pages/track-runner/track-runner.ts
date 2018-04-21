import { Component, ViewChild, ElementRef, OnInit  } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions, CameraPosition, MarkerOptions, Marker } from '@ionic-native/google-maps';
import { AngularFireAuth } from 'angularfire2/auth';
import { Camera } from '@ionic-native/camera';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation';

declare var google: any;
/**
 * Generated class for the TrackRunnerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-track-runner',
  templateUrl: 'track-runner.html',
})
export class TrackRunnerPage {
	@ViewChild('map') mapRef:ElementRef;
  options : GeolocationOptions;
  currentPos : Geoposition;
  userPosition: any;
  latitude: number = 1.562568;
  longitude: number = 103.638837;
  runnerlatitude: number;
  runnerlongitude: number
;  autocompleteService: any;
  placesService: any;
  constructor(    private afAuth: AngularFireAuth, 
    private geolocation : Geolocation,
    public loadingCtrl: LoadingController,
    private afDatabase: AngularFireDatabase, 
    public navCtrl: NavController) {
  }

  displayMap(){
	  var directionsService = new google.maps.DirectionsService();
	  var directionsDisplay = new google.maps.DirectionsRenderer();
	  var customer = new google.maps.LatLng(this.latitude, this.longitude);
	  var runner = new google.maps.LatLng(1.5588052, 103.64651669999999);
	    const mapOptions = {
	      center: customer,
	      zoom: 19,
	      streetViewControl: false,
	      mapTypeId: 'roadmap'
	    };
    const map = new google.maps.Map(this.mapRef.nativeElement,mapOptions);
    directionsDisplay.setMap(map);
    console.log(this.mapRef.nativeElement);


  var request = {
      origin: customer,
      destination: runner,
      // Note that Javascript allows us to access the constant
      // using square brackets and a string value as its
      // "property."
      travelMode: google.maps.TravelMode['DRIVING']
  };
  directionsService.route(request, function(response, status) {
    console.log(status);

    if (status == 'OK') {
      directionsDisplay.setDirections(response);
    }
  });
}
  getUserPosition(){
      this.options = {
          enableHighAccuracy : true
      };

      this.geolocation.getCurrentPosition(this.options).then((pos : Geoposition) => {

          this.currentPos = pos;
          console.log(pos); 
          this.runnerlatitude = pos.coords.latitude;
          this.runnerlongitude = pos.coords.longitude; 

          console.log(this.latitude);
          console.log(this.longitude);    
          console.log(pos);

      },(err : PositionError)=>{
          console.log("error : " + err.message);
      });
      
  }
}
