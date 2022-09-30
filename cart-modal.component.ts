import { Component, OnInit } from '@angular/core';
import { CartService } from './CartService.service'

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.css']
})
export class CartModalComponent implements OnInit {

	cart:any;

	constructor(private cartService:CartService) { 
		this.cartService.getMessage().subscribe(() => {
        	this.cart = this.cartService.getCart();
      	});
	}

	ngOnInit() {
		this.cart = this.cartService.getCart();
	}

	valid(event) {
		if (this.cart.totalProducts == undefined || this.cart.totalProducts < 0) {
			event.stopPropagation();
		}
	}

	minusItem(product:any) {
  		if (product.quantity >= 1) {
  			this.cartService.minusItem(product);
  			this.cart = this.cartService.getCart();
  		}
  		this.cart = this.cartService.getCart();
  	}

  	plusItem(product:any) {
  		this.cartService.plusItem(product);
  		this.cart = this.cartService.getCart();
  	}

  	removeItem(event, product:any) {
  		this.cartService.removeItem(product);
  		this.cart = this.cartService.getCart();
  		event.stopPropagation();
  	}

}
