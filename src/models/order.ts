export interface Order{
	$key: string;
	orderID:string; //to pass between order-list and order
	menu: string;
	quantity: number;
	totalPrice: number;
	customer: string;
	location: string;
	fdsp: string;
	menuName: string;
	status: number;//0-to pay, 1-paid, 2-to deliver, 3-to receive, 4-completed, 5-cancelleded
	menuPhoto: string;
	menuPrice: number;
	selfDelivery: number; //0-false, 1-true
	orderDate: string;
	runner: string;
	paid: boolean;
}