import {Injectable} from "@angular/core";
import {OrderService} from "../services/order.service";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {tap} from "rxjs/operators";
import {GetOrders} from "./actions/order.action";
import {GetOrderByIDStateModel, OrderStateModel} from "./models/order";
import {GetOrderByID} from "./actions/order.action";

@State<OrderStateModel>({
    name: 'Orders',
    defaults: {
        Orders: [],
        Pagination: null,
    },
})

@State<GetOrderByIDStateModel>({
    name: 'GetOrderByID',
    defaults: {
        OrderDetail : {
            order_id: 0,
            status: '',
            created_date: '',
            customer: {
                customer_id: 0,
                nation_number: '',
                first_name: '',
                last_name: '',
                is_active: true,
                customer_contact_dto_list: []
            },
            order_details: [{
                order_detail_id: 0,
                order_id: 0,
                product_id: 0,
                status: '',
                product_name: '',
                product_price: 0
            }]
        }
    }
})

@Injectable()
export class OrderState {
    constructor(private orderService: OrderService) {
    }

    @Selector()
    static getOrderList(OrderList: OrderStateModel) {
        return OrderList;
    }

    @Selector()
    static getOrderByID(Order: GetOrderByIDStateModel) {
        return Order;
    }

    @Action(GetOrders)
    getOrders({patchState}: StateContext<OrderStateModel>, payload) {
        return this.orderService.getAllOrders(payload.params).pipe(tap((response: any) => {
            patchState({Orders: response.data, Pagination: response.data});
        }));
    }

    @Action(GetOrderByID)
    getOrderByID({patchState}: StateContext<any>, payload) {
        return this.orderService.getOrderByID(payload.OrderID).pipe(tap((response: any) => {
            patchState({OrderDetail: response.data})
        }));
    }
}
