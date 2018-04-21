import { Component, ChangeDetectorRef,OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { IonicPage, PopoverController, NavController, LoadingController, NavParams, ToastController, AlertController, Events } from 'ionic-angular';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions, CameraPosition, MarkerOptions, Marker } from '@ionic-native/google-maps';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subscription } from 'rxjs/Subscription';

import { LoginPage } from '../login/login';
import { FoodPage } from '../food/food';
import { CartPage } from '../cart/cart';
import { MakeOrderPage } from '../make-order/make-order';
import { Menu } from '../../models/menu';
import { Profile } from '../../models/profile';
import { Order } from '../../models/order';
import { Favourite } from '../../models/favourite';
/**
 * Generated class for the FoodTypePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google: any;

@IonicPage()
@Component({
  selector: 'page-food-type',
  templateUrl: 'food-type.html',
})
export class FoodTypePage implements OnInit{

  options : GeolocationOptions;
  currentPos : Geoposition;
  menus: Observable<any[]>;
  //menuss: Observable<any[]>;
  public menuss: Menu[] = [];
  public profiles: Profile[] = [];
  profileData: Observable<any[]>;
  orders: Observable<any[]>;
  alive: boolean = false;
  profileDetails: Subscription;
  menuDetails: Subscription;
  profile: Subscription;
  menuData: Subscription;
  uid: string ="";
  uname: string = "";
  menu = {} as Menu;
  menuName: string="";
  location: string;
  locationID: string;
  preOrder: boolean;
  items = {} as string;
  getFavData: Subscription;
  favouriteID: string;
  starColour: string = "favorite";
  fav = {} as Favourite;
  favID: string[] = [];
  check: boolean;
  places: any = [];
  autocompleteItems: any;
  autocomplete: any = {
      query: ''
    };
  autocompleteService: any;
  placesService: any;
  acService:any;
  i: number;
  geocoder: any;
  latitude: number;
  longitude: number;
  posFdsp = {lat: 0, lng: 0};
  fdspLocationID: string;
  getfdspLocationData: Subscription;
  fdspLat: number;
  fdspLng: number;
  distance: number;
  selectObject: string = "default";
  emptyData: boolean = false;

  constructor(private geolocation : Geolocation,
    private afAuth: AngularFireAuth, 
  	private afDatabase: AngularFireDatabase, 
  	public navParams: NavParams, 
  	private toast: ToastController,
  	public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public popoverCtrl: PopoverController,
    public events: Events,
    private changeDetectorRef:ChangeDetectorRef,
    public alertCtrl: AlertController) {
    this.location = this.navParams.get('location');
    this.locationID = this.navParams.get('locationID');
    this.preOrder = false;
    this.getUserPosition();
    this.geocoder = new google.maps.Geocoder;
  }
  viewFood(selectedObject){
    this.alive=true;
    this.menuss = [];
    this.afAuth.authState.take(1).subscribe(data => {
        this.profileDetails = this.afDatabase.list(`profile/`).take(1).subscribe(snapshot =>{
          snapshot.forEach(data =>{
            this.menuDetails = this.afDatabase.list(`profile/${data.$key}/menu-list`).take(1).subscribe(snapshot =>{
              snapshot.forEach(data =>{
                if(selectedObject == "fav" && this.favID.indexOf(`${data.$key}`) > -1 && `${data.status}` == 'Active'){
                  this.menuss.push(data);    
                  this.emptyData = false;          
                }//end if selectObject
                else if (`${data.category}` == selectedObject && `${data.status}` == 'Active' && `${data.fdsp}` != `${this.uname}`)
                {
                  this.menuss.push(data);
                  this.emptyData = false;
                }//end if
              })//end data menuDetails
            })//end snapshot menuDetails      
          });//end data profileDetails
        })//end snapshot profileDetails
    });    
    this.selectObject = selectedObject;
    console.log(this.menuss.length);
    //this.navCtrl.push(FoodPage, {food: type});

    if(this.menuss.length == 0){
      this.emptyData = true;
    }
  }
  calculateDistance(lat1:number,lat2:number,long1:number,long2:number){
      let p = 0.017453292519943295;    // Math.PI / 180
      let c = Math.cos;
      let a = 0.5 - c((lat1-lat2) * p) / 2 + c(lat2 * p) *c((lat1) * p) * (1 - c(((long1- long2) * p))) / 2;
      let dis = (12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
      return dis;
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

      },(err : PositionError)=>{
          console.log("error : " + err.message);
      });
  }
  chooseItem(item){
    console.log(item);
    this.autocomplete.query = item.description;
    this.autocompleteItems = [];
    this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
      console.log(results);
      console.log(results[0]);
      if(status === 'OK' && results[0]){
            this.posFdsp = {
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng()
        };
        console.log(this.posFdsp);
        this.fdspLat = this.posFdsp.lat;
        this.fdspLng = this.posFdsp.lng;
        this.menuss = [];
        this.profileDetails = this.afDatabase.list(`profile/`).take(1).subscribe(snapshot =>{
          snapshot.forEach(data =>{
            console.log(`${data.name}`);
            this.getfdspLocationData = this.afDatabase.object(`profile/${data.key}/location/${data.locationFdsp}`).take(1).subscribe(snapshot =>{
              this.fdspLng = parseFloat(`${snapshot.longitude}`);
              this.fdspLat = parseFloat(`${snapshot.latitude}`);
            }),
            this.distance = this.calculateDistance(this.fdspLat, this.latitude, this.fdspLng, this.longitude);
            this.menuDetails = this.afDatabase.list(`profile/${data.$key}/menu-list`).take(1).subscribe(snapshot =>{
              snapshot.forEach(data =>{
                console.log(this.selectObject);
                if(this.selectObject == "fav" && this.favID.indexOf(`${data.$key}`) > -1 && `${data.status}` == 'Active' && this.distance < 25){
                  this.menuss.push(data);   
                  this.emptyData = false;           
                }//end if selectObject
                else if (`${data.category}` == this.selectObject && `${data.status}` == 'Active' && `${data.fdsp}` != `${this.uname}` && this.distance < 25)
                {
                  this.menuss.push(data);
                  this.emptyData = false;
                }//end if
                else if(`${data.status}` == 'Active' && `${data.fdsp}` != `${this.uname}` && this.distance < 25 && this.selectObject == "default"){
                  this.menuss.push(data);
                  this.emptyData = false;
                }
              })//end data menuDetails
            })//end snapshot menuDetails      
          });//end data profileDetails
        })//end snapshot profileDetails
        }
    });
    console.log(this.menuss.length);
    console.log(this.menuss);
    //this.navCtrl.push(FoodPage, {food: type});

    if(this.menuss.length == 0){
      this.emptyData = true;
    }
  }
  goCart(){
    this.navCtrl.push(CartPage);
  }
  makeOrder(menuID: string, fdspID: string){
    console.log(menuID);
    this.navCtrl.push(FoodPage, {key: menuID, fdspKey: fdspID, parentPage: this});
  }
  ionViewWillLoad(){
  	this.afAuth.authState.take(1).subscribe(data => {
        this.uid = `${data.uid}`;
  			this.profileData = this.afDatabase.object(`profile/${data.uid}`),
        this.profile = this.afDatabase.object(`profile/${data.uid}`).take(1).subscribe(snapshot => {
          this.uname = `${snapshot.name}`;
        }),
        this.profileDetails = this.afDatabase.list(`profile/`).take(1).subscribe(snapshot =>{//open snapshot profileDetails
          snapshot.forEach(data =>{//open data profileDetails
            console.log(`${data.name}`);
            this.menuDetails = this.afDatabase.list(`profile/${data.$key}/menu-list`).take(1).subscribe(snapshot =>{//open snapshot menuDetails
              snapshot.forEach(data =>{//open data menuDetails
                if (`${data.status}` == 'Active' && `${data.fdsp}` != `${this.uid}`)
                {
                  console.log(`${data.photoURL}`);
                  this.menuss.push(data);
                  this.emptyData = false;
                }
              })//end data menuDetails
            }) //end snapshot menuDetails
          });//end data profileDetails
        }),//end snapshot profileDetails
      this.getFavData = this.afDatabase.list(`profile/${this.uid}/favourite/`).take(1).subscribe(snapshot =>{
        snapshot.forEach(data =>{
          this.favID.push(`${data.menuID}`);
        })
      })
  	});
    console.log(this.menuss.length);
    //this.navCtrl.push(FoodPage, {food: type});

    if(this.menuss.length == 0){
      this.emptyData = true;
    }
  }
  getItems(ev){
    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.menuss = this.menuss.filter((item) => {
        return (item.menuName.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  checkPreOrder(num){
    if(num == 1)
    {
      return true;
    }
    return false;
  }
  checkFavourite(menuID){ 
      if(this.favID.indexOf(menuID) > -1){
      return true;
      }
      else{
        return false;
      }
  }
  favourite(menuID){
    this.fav.menuID = menuID
    this.afDatabase.list(`profile/${this.uid}/favourite/`).push(this.fav);
  }
  ngOnInit() {
    this.acService = new google.maps.places.AutocompleteService();        
    this.autocompleteItems = [];
    this.autocomplete = {
        query: ''
    };        
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
