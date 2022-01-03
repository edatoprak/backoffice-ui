import {Component, OnInit, ViewChild} from '@angular/core';
import {Select, Store} from "@ngxs/store";
import {OrderState} from "../../../shared/state/order.state";
import {OrderStateModel} from "../../../shared/state/models/order";
import {Observable} from "rxjs";
import {GetOrders} from "../../../shared/state/actions/order.action";
import {MatPaginator} from "@angular/material/paginator";

@Component({
    selector: 'app-order-list',
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {

    @Select(OrderState.getOrderList)
    orders$: Observable<OrderStateModel>;

    @ViewChild(MatPaginator) private _paginator: MatPaginator;

    ordersTableColumns: string[] = [
        'order_id',
        'first_name',
        'last_name',
        'created_date',
        'status'
    ];
    drawerMode: 'over' | 'side' = 'side';
    isLoading: boolean = false;

    constructor(private store: Store) {
    }

    ngOnInit(): void {
    }

    paging(e) {
        this.store.dispatch([
            new GetOrders({
                page: e.pageIndex,
                size: 5,
                status: ''
            }),
        ]);
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

}
