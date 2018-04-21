export interface Profile{
	//when register
	$key: string;
	name: string;
	phoneNo: string;
	gender: string;
	birthDate: string;
	runner: number; // 0-false | 1-true
	fdsp: number; // 0-false | 1-true
	photoURL: string;
	defaultAddress: string; //id default address

	//fdsp data//
	fdspLocation: string;
	deliveryNo: number; //0-use runner||1-self-delivery

	//runner data//
	vehicle: string;
	vehicleColour: string;
	plateNumber: string;
	runnerLocation: string;
	runnerActive: number; //0-not active, 1-active
}	