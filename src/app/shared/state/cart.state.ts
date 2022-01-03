import {Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {tap} from "rxjs/operators";
import {CartService} from "../services/cart.service";
import {AddProductToCart, GetCustomerCart, RemoveProductFromCart, UpdateCart} from "./actions/cart.action";
import {AddProductToCartStateModel, CustomerCartStateModel} from "./models/cart";
import {AddProductStateModel} from "./models/product";



@State<CustomerCartStateModel>({
    name: 'GetCustomerCart',
    defaults: {
        GetCustomerCart:{
            created_date: "",
            customer: {
                customer_contact_dto_list: [],
                customer_id: 0,
                first_name: "",
                is_active: true,
                last_name: "",
                nation_number: ""
            },
            order_details: [],
            order_id: 0,
            status: ""}
    }
})
@State<any>({
    name: 'RemoveProductFromCart',
    defaults: {
        RemoveProductFromCart: 0
    }
})
@Injectable()
export class CartState {

    constructor(private cartService: CartService) {
    }

    @Selector()
    static getCustomerCart(Cart) {
        return Cart.GetCustomerCart;
    }
    @Selector()
    static addProductToCart(Cart) {
        return Cart.GetCustomerCart;
    }

    @Action(GetCustomerCart)
    getCustomerCart({patchState}: StateContext<any>, payload) {
        return this.cartService.getCustomerCart(payload.params).pipe(tap((response: any) => {
            patchState({GetCustomerCart:response.data });
        }));
    }
    @Action(UpdateCart)
    updateCart({patchState}: StateContext<any>, payload) {
        return this.cartService.updateOrder(payload.params).pipe(tap((response: any) => {
            patchState({GetCustomerCart:response.data });
        }));
    }
    @Action(AddProductToCart)
    addProductToCart({patchState}: StateContext<any>, payload) {
        return this.cartService.addToCart(payload.params.customer_id,payload.params.product_id).pipe(tap((response: any) => {
            patchState({GetCustomerCart:response.data });
        }));
    }
    @Action(RemoveProductFromCart)
    removeProductFromCart({patchState}: StateContext<any>, payload) {
        return this.cartService.RemoveProductFromCart(payload.params.order_detail_id).pipe(tap((response: any) => {
            patchState({RemoveProductFromCart:response });
        }));
    }

}
