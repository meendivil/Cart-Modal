export class Discount {

	uuid:string;
	value:number;
	//code:string;
	minPurchase:number;
	couponTypeId:number;
	expiration:Date;

	constructor()
	constructor(discount:any)
	constructor(discount?:any){
		this.uuid = discount.uuid;
		this.value = discount.value;
		//this.code = discount.code;
		this.minPurchase = discount.minPurchase;
		this.couponTypeId = discount.couponTypeId;
		this.expiration = discount.expiration;
	}
}