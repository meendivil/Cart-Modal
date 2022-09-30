import { Injectable } from '@angular/core';
import { Cart } from './cart';
import { Discount } from './discount';
import { CartProduct } from './cartProduct';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable()
export class CartService {
   //private subject = new Subject<any>();
   public subject = new BehaviorSubject(null);

	public cart:Cart;

  	constructor() { }

   getCart () {
      this.cart = JSON.parse(localStorage.getItem("temporary_cart"));
      return this.cart;
   }

  	addItem (quantity:number, item:any){
    	this.cart = JSON.parse(localStorage.getItem("temporary_cart"));
      
      if (this.cart != null && Object.entries(this.cart).length != 0) {
         let cartProductFiltered:CartProduct;
         let productIsInCart:boolean = false;
         Object.keys(this.cart.products).forEach(value => {
            if (this.cart.products[value].sku === item.sku) {
               this.cart.products[value].quantity = this.cart.products[value].quantity + (quantity);
               this.cart.products[value].totalPrice = this.cart.products[value].totalPrice + 
                                                      (item.price * quantity);
               this.cart.products[value].originalTotalPrice = this.cart.products[value].originalTotalPrice + 
                                                      (item.price * quantity);
               productIsInCart = true;
            }
         });

         if (!productIsInCart) {
            this.cart.products.push(new CartProduct(quantity, item));
         }

         this.cart.originalTotalPrice = this.cart.originalTotalPrice + (item.price * quantity);
         this.cart.totalPrice = this.cart.totalPrice + (item.price * quantity);
         this.cart.totalProducts = this.cart.totalProducts + quantity;
         localStorage.setItem("temporary_cart", JSON.stringify(this.cart));
      }else{
         this.cart = new Cart(this.uuidv4(), quantity, item);
         localStorage.setItem("temporary_cart", JSON.stringify(this.cart));
      }

      this.subject.next(null);
   }

   minusItem (item:any){
       this.cart = JSON.parse(localStorage.getItem("temporary_cart"));
      
      if (this.cart != null) {
         let cartProductFiltered:CartProduct;
         let productIsInCart:boolean = false;
         Object.keys(this.cart.products).forEach(value => {
            if (this.cart.products[value].sku === item.sku) {
               if (this.cart.products[value].quantity-1 === 0) {
                  this.removeItem(item);
                  this.checkDiscount();
                  return;
               } else {
                  this.cart.products[value].quantity = this.cart.products[value].quantity-1;

                  this.cart.products[value].totalPrice = this.cart.products[value].totalPrice - 
                                                         this.cart.products[value].unitPrice;
                  this.cart.products[value].originalTotalPrice = this.cart.products[value].originalTotalPrice - 
                                                         this.cart.products[value].unitPrice;;
                  productIsInCart = true;

                  this.cart.originalTotalPrice = this.cart.originalTotalPrice - item.unitPrice;
                  this.cart.totalProducts = this.cart.totalProducts - 1;
                  this.cart.totalPrice = this.cart.totalPrice - item.unitPrice;
                  // this.cart.totalProducts = this.cart.totalProducts + quantity;
                  localStorage.setItem("temporary_cart", JSON.stringify(this.cart));
                  this.checkDiscount();
               }
            }
         });

      }else{
         // this.cart = new Cart(this.uuidv4(), quantity, item);
         // localStorage.setItem("temporary_cart", JSON.stringify(this.cart));
      }

      this.subject.next(null);
   }

   plusItem (item:any){
       this.cart = JSON.parse(localStorage.getItem("temporary_cart"));
      
      if (this.cart != null) {
         let cartProductFiltered:CartProduct;
         let productIsInCart:boolean = false;
         Object.keys(this.cart.products).forEach(value => {
            if (this.cart.products[value].sku === item.sku) {
               this.cart.products[value].quantity = this.cart.products[value].quantity+1;

               this.cart.products[value].totalPrice = this.cart.products[value].totalPrice + 
                                                      this.cart.products[value].unitPrice;
               this.cart.products[value].originalTotalPrice = this.cart.products[value].originalTotalPrice + 
                                                      this.cart.products[value].unitPrice;
               productIsInCart = true;
            }
         });

         this.cart.originalTotalPrice = this.cart.originalTotalPrice + item.unitPrice;
         this.cart.totalPrice = this.cart.totalPrice + item.unitPrice;
         this.cart.totalProducts = this.cart.totalProducts + 1;
         localStorage.setItem("temporary_cart", JSON.stringify(this.cart));
      }else{
         // this.cart = new Cart(this.uuidv4(), quantity, item);
         // localStorage.setItem("temporary_cart", JSON.stringify(this.cart));
      }

      this.subject.next(null);
   }

   getMessage():Observable<any>{
      return this.subject.asObservable();
   }

   removeItem (item:any) {
      this.cart = JSON.parse(localStorage.getItem("temporary_cart"));
      
      if (this.cart != null) {
         Object.keys(this.cart.products).forEach(value => {
            if (this.cart.products[value] != undefined && this.cart.products[value] != null && 
               this.cart.products[value].sku === item.sku) {
               let tempProduct:CartProduct = this.cart.products[value];
               
               let indexBank = this.cart.products.map(bank => bank.sku).indexOf(item.sku);
               this.cart.products.splice(indexBank, 1);
               

               this.cart.originalTotalPrice = this.cart.originalTotalPrice - tempProduct.totalPrice;
               this.cart.totalPrice = this.cart.totalPrice - tempProduct.totalPrice;
               this.cart.totalProducts = this.cart.totalProducts - tempProduct.quantity;
               localStorage.setItem("temporary_cart", JSON.stringify(this.cart));
               this.checkDiscount();      
            }
         });
      }

      this.subject.next(null);
   }

   calculateDiscount(discount:any) {
      this.cart = JSON.parse(localStorage.getItem("temporary_cart"));
      this.cart.totalDiscount = discount.value;
      this.cart.totalPrice =  this.cart.totalPrice - discount.value
      this.cart.codes.push(new Discount(discount));

      localStorage.setItem("temporary_cart", JSON.stringify(this.cart));
   }

   checkDiscount() {
      this.cart = JSON.parse(localStorage.getItem("temporary_cart"));
      if (this.cart.codes != undefined && Object.keys(this.cart.codes).length != 0) {
         if (this.cart.originalTotalPrice < this.cart.codes[0].minPurchase) {
            this.cart.codes.splice(0, 1);
            this.cart.totalPrice = this.cart.originalTotalPrice;
            localStorage.setItem("temporary_cart", JSON.stringify(this.cart));
         }
      }
   }

   removeAllItems () {
      this.cart = new Cart(this.uuidv4(), 0, {});
      localStorage.setItem("temporary_cart", JSON.stringify(this.cart));

      this.subject.next(null);
   }

   uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
       var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
         return v.toString(16);
     });
   }
}
