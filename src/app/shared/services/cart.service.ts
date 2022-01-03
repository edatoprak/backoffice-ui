import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ListParams} from "../state/models/order";

@Injectable({
    providedIn: 'root'
})
export class CartService {

    constructor(private _httpClient: HttpClient) {
    }

    getCustomerCart(customerid: number) {
        return this._httpClient.get('http://159.69.28.194:8080/api/v1/customers/' + customerid + '/getcustomercart/Waiting');
    }
    updateOrder(params){
        return this._httpClient.post('http://159.69.28.194:8080/api/v1/carts/update', {
            order_details: [],
            order_id: params.order_id,
            status: params.status
        });
    }
    addToCart(customerid: number, productid: number) {
        return this._httpClient.post('http://159.69.28.194:8080/api/v1/carts/addProductToCart', {
            count: 1,
            customer_id: customerid,
            product_id: productid
        });
    }
    RemoveProductFromCart(order_detail_id: number) {
        return this._httpClient.post('http://159.69.28.194:8080/api/v1/carts/removeProductFromCart', {
            order_detail_id: order_detail_id
        });
    }
}
