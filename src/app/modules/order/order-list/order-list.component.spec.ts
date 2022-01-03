import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OrderListComponent} from './order-list.component';
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {HttpClient, HttpHandler} from "@angular/common/http";
import {OrderService} from "../../../shared/services/order.service";
import {NgxsModule, Store} from "@ngxs/store";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterTestingModule} from "@angular/router/testing";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatSidenavModule} from "@angular/material/sidenav";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {OrderState} from "../../../shared/state/order.state";
import {of} from "rxjs";
import {CustomerState} from "../../../shared/state/customer.state";

describe('OrderListComponent', () => {
    let component: OrderListComponent;
    let fixture: ComponentFixture<OrderListComponent>;
    let store: Store;
    let orderService: OrderService;
    let formBuilder: FormBuilder;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OrderListComponent],
            imports: [NgxsModule.forRoot([OrderState]), FormsModule, ReactiveFormsModule, RouterTestingModule, BrowserAnimationsModule, MatSidenavModule, HttpClientTestingModule],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [OrderService, HttpClient, HttpHandler]
        })
        orderService = TestBed.inject(OrderService);
        store = TestBed.inject(Store);
        fixture = TestBed.createComponent(OrderListComponent);
        component = fixture.componentInstance;
        Object.defineProperty(component, 'orders$', {writable: true});

        component.orders$ = of()
        fixture.detectChanges();
    });


    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it(`ordersTableColumns has default value`, () => {
        expect(component.ordersTableColumns).toEqual([
            `order_id`,
            `first_name`,
            `last_name`,
            `created_date`,
            `status`
        ]);
    });

    it(`drawerMode has default value`, () => {
        expect(component.drawerMode).toEqual(`side`);
    });

    it(`isLoading has default value`, () => {
        expect(component.isLoading).toEqual(false);
    });

    it('paging', () => {
        spyOn(orderService, 'getAllOrders').and.callFake(function (value) {
            return of({
                "success": true,
                "id": null,
                "message": null,
                "data": {
                    "content": [],
                    "page": 0,
                    "size": 5,
                    "total_elements": 0,
                    "total_pages": 0,
                    "last": true
                }
            });
        })
        component.paging({value: 0})
        const orderList = store.selectSnapshot(OrderState.getOrderList);
        expect(orderList.Orders).toBeTruthy();
    });

    describe('trackByFn', () => {
        it('makes expected calls', () => {
            expect(component.trackByFn(1, {id: 1})).toEqual(1);
        });
    });

    describe('ngOnInit', () => {
        it('makes expected calls', () => {
            component.ngOnInit();
        })
    })

});
