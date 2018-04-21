export interface Delivery{
	$key: string;
	orderID: string;
	custID: string;
	fdspID: string;
	runnerID: string;
	paid: number;
	status: number; //0-new, 1-completed, 2-rejected

	//order
	menuName: string;
	totalPrice: string;
	location: string;

	//customer
	customerName:string;
	customerPhoneNo: string;

	//fdsp
	fdspName: string;
	fdspPhoneNo: string;
	
}