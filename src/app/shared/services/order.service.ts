import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ListParams} from "../state/models/order";

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    constructor(private _httpClient: HttpClient) {
    }

    getAllOrders(listparams: ListParams) {
        return this._httpClient.post('http://159.69.28.194:8080/api/v1/carts/getall', listparams);
    }

    getOrderByID(orderId) {
        return this._httpClient.get('http://159.69.28.194:8080/api/v1/carts/getbyid/' + orderId)
    }
}
