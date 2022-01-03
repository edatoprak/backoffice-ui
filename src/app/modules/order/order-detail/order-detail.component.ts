import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Select, Store} from "@ngxs/store";
import {Observable} from "rxjs";
import {OrderState} from "../../../shared/state/order.state";
import {GetOrderByIDStateModel} from "../../../shared/state/models/order";
import {GetOrderByID} from "../../../shared/state/actions/order.action";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {skip} from "rxjs/operators";

@Component({
    selector: 'app-order-detail',
    templateUrl: './order-detail.component.html',
    styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
    @Select(OrderState.getOrderByID) orders$: Observable<GetOrderByIDStateModel>;
    orderId: number;


    ordersTableColumns: string[] = [
        'product_id',
        'product_name',
        'product_price',
        'product_short_description',
        'status',
        'cancel'
    ];
    pendingStatus: number = 0;
    completedStatus: number = 0;
    createdDate: string;
    totalAmount:number = 0;

    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public _formBuilder: FormBuilder,
        public store: Store
    ) {
    }

    ngOnInit(): void {
        this.orderId = +this.route.snapshot.paramMap.get('id');

        this.orders$.subscribe(data => {
            if(data.OrderDetail){
                this.createdDate = data.OrderDetail.created_date;
                data.OrderDetail.order_details.forEach(detail => {
                    this.totalAmount += detail.product_price;
                    if (detail.status == 'Confirmed') {
                        this.completedStatus++;
                    } else if (detail.status == 'Waiting') {
                        this.pendingStatus++;
                    }
                })
            }

        })

        this.store.dispatch([new GetOrderByID(this.orderId)]);

    }

}
