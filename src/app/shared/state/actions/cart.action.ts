import {ListParams} from "../models/order";

export class GetCustomerCart {
    static readonly type = '[CustomerCart] get Customer Cart';
    static readonly desc = 'get Customer Cart';

    constructor(public params: any) {
    }
}

export class AddProductToCart {
    static readonly type = '[AddProductToCart] add Customer Cart';
    static readonly desc = 'add Customer Cart';

    constructor(public params: {
        customer_id: number,
        product_id: number
    }) {
    }
}
export class RemoveProductFromCart {
    static readonly type = '[RemoveProductFromCart] del Customer Cart';
    static readonly desc = 'del Customer Cart';

    constructor(public params: {
        order_detail_id: number
    }) {
    }
}

export class UpdateCart {
    static readonly type = '[UpdateCart] UpdateCart';
    static readonly desc = 'UpdateCart';

    constructor(public params: {
        order_id: number,
        status: string
    }) {
    }
}
