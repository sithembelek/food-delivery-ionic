import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
/*
  Generated class for the GeocoderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GeocoderProvider {

  constructor(
  	private _GEOCODE  : NativeGeocoder
  	) {
    console.log('Hello GeocoderProvider Provider');
  }
	reverseGeocode(lat : number, lng : number) : Promise<any>
	{
	   return new Promise((resolve, reject) =>
	   {
	      this._GEOCODE.reverseGeocode(lat, lng)
	      .then((result : NativeGeocoderReverseResult) =>
	      {
	         let str : string   = `The reverseGeocode address is`;
	         resolve(str);
	      })
	      .catch((error: any) =>
	      {
	         reject(error);
	      });
	   });
	}
	forwardGeocode(keyword : string) : Promise<any>
	{
	   return new Promise((resolve, reject) =>
	   {
	      this._GEOCODE.forwardGeocode(keyword)
	      .then((coordinates : NativeGeocoderForwardResult) =>
	      {
	         let str : string   = `The coordinates are latitude=${coordinates.latitude} and longitude=${coordinates.longitude}`;
	         resolve(str);
	      })
	      .catch((error: any) =>
	      {
	         reject(error);
	      });
	   });
	}
}
