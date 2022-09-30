import { CartProduct } from './cartProduct';
import { Discount } from './discount'

export class Cart {

	token:string;
	note:string;
	originalTotalPrice:number;
	totalPrice:number;
	totalDiscount:number;
	totalProducts:number;
	products:CartProduct[];
	codes:Discount[]=[];

	constructor()
	constructor(token:string, quantity:number, item:any)
	constructor(token?:string, quantity?:number, item?:any){
		this.token = token;//this.uuidv4();
		this.note = "";		
		this.totalDiscount = 0;
		this.totalProducts = quantity;
		
		if (Object.keys(item).length > 0) {
			this.originalTotalPrice = item.price * quantity;
			this.totalPrice = item.price * quantity;
			this.products = [new CartProduct(quantity, item)];
		} else {
			this.originalTotalPrice = quantity;
			this.totalPrice = quantity;
			this.products = [];
		}
	}
}