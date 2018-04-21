export interface Menu{
	//in Add Menu
	$key: string;
	menuName: string;
	menuPrice: number;
	category: string;	
	status: string; //0-inactive || 1-active
	desc: string;
	spicy: number;
	photoURL: string;
	fdsp: string;
	fdspPhoto:string;
	//Open Order ////update status to active
	stock: number;
	date: string; //date delivery
	time: string; //time delivery
	preOrder:number; //1-preorder,0-not preorder
}