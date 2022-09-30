import { environment }  from '../../../environments/environment';

export class CartProduct {

	quantity:number;
	title:string;
	unitPrice:number;
	originalUnitPrice:number;
	discountUnitPrice:number;
	totalPrice:number;
	originalTotalPrice:number;
	totalDiscount:number;
	sku:string;
	url:string;
	image:string;

	constructor(quantity:number, item:any){
		this.quantity = quantity;
		this.title = item.name;
		this.unitPrice = item.price;
		this.originalUnitPrice = item.price;
		this.discountUnitPrice = 0;
		this.totalPrice = item.price * quantity;
		this.originalTotalPrice = item.price * quantity;
		this.totalDiscount = 0;
		this.sku = item.sku;
		this.url = environment.APIEndpoint === undefined ? "/" + item.sku : environment.APIEndpoint + item.sku;
		this.image = item.image[0].url;
	}
}