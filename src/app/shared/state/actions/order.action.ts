import {ListParams} from "../models/order";

export class GetOrders {
    static readonly type = '[Orders] get all orders';
    static readonly desc = 'get all orders';

    constructor(public params: ListParams) {
    }
}

export class GetOrderByID {
    static readonly type = '[GetOrderByID] Get GetOrderByID';
    static readonly desc = 'GetOrderByID ';
    constructor(public OrderID: Number) {}
}
