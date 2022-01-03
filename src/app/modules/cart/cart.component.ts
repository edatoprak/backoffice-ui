import {Component, OnInit} from '@angular/core';
import {GetCustomerCart, RemoveProductFromCart, UpdateCart} from "../../shared/state/actions/cart.action";
import {Select, Store} from "@ngxs/store";
import {MainService} from "../../shared/main.service";
import {CartState} from "../../shared/state/cart.state";
import {Observable, of} from "rxjs";
import {CustomerCartStateModel} from "../../shared/state/models/cart";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {catchError, skip} from "rxjs/operators";

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
    @Select(CartState.getCustomerCart) carts$: Observable<any>;
    customer_id: number;
    listCol = ["id", "product_barcode", "product_name", "product_short_description", "product_price", "status"];
    total = 0;

    constructor(public store: Store,
                public mainservice: MainService,
                private route: ActivatedRoute,
                private toastr: ToastrService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.carts$.subscribe(cart => {
            this.total = 0;
            if (cart&& cart.order_details){
                cart.order_details.forEach(ord => {
                    this.total += ord.product_price;
                });
            }
            if (cart && cart.order_id != 0 && this.mainservice.cartset) {
                this.getCart();
            }
        });
        this.getCart();
    }

    getCart() {
        if (this.mainservice.selectedCustomer && this.mainservice.selectedCustomer.customer_id && this.mainservice.selectedCustomer.customer_id > 0) {
            this.customer_id = this.mainservice.selectedCustomer.customer_id;
            this.mainservice.cartset = false;
            this.store.dispatch(new GetCustomerCart(this.customer_id)) .pipe(catchError(error => {return of(false)})).subscribe((cart) => {
                this.total = 0;
                if (cart.GetCustomerCart.GetCustomerCart&& cart.GetCustomerCart.GetCustomerCart.order_details){
                    cart.GetCustomerCart.GetCustomerCart.order_details.forEach(ord => {
                        this.total += ord.product_price;
                    });
                }
            });
        } else {
            this.customer_id = +this.route.snapshot.paramMap.get('id');
            if (this.customer_id && this.customer_id > 0) {
                this.store.dispatch(new GetCustomerCart(this.customer_id)).pipe(catchError(error => {return of(false)})).subscribe((cart) => {
                    this.mainservice.selectedCustomer = cart.customer;
                    this.mainservice.cartset = false;
                    this.total = 0;
                    if (cart.GetCustomerCart.GetCustomerCart&& cart.GetCustomerCart.GetCustomerCart.order_details){
                        cart.GetCustomerCart.GetCustomerCart.order_details.forEach(ord => {
                            this.total += ord.product_price;
                        });
                    }
                });
            }
        }
    }

    UpdateCart(status, order_id) {
        this.store.dispatch(new UpdateCart({status: status, order_id: order_id})).pipe(catchError(error => {return of(false)})).subscribe((data) => {
            this.toastr.success('Başarılı');
            this.router.navigate(['/product/list']);
            this.mainservice.selectedCustomer=null;
        });
    }
    RemoveProductFromCart(order_detail_id){
        this.store.dispatch(new RemoveProductFromCart(order_detail_id)).subscribe(data=>{
            this.getCart();
        })
    }
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

}
