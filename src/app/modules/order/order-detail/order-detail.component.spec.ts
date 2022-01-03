import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';
import {NgxsModule, Store} from '@ngxs/store';
import {FormBuilder, FormsModule, NgForm, ReactiveFormsModule} from '@angular/forms';
import {OrderDetailComponent} from './order-detail.component';
import {CustomerState} from "../../../shared/state/customer.state";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatSelectModule} from "@angular/material/select";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatChipsModule} from "@angular/material/chips";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {CustomerService} from "../../../shared/services/customer.service";
import {CommonService} from "../../../shared/services/common.service";
import {ToastrService} from "ngx-toastr";
import {OrderState} from "../../../shared/state/order.state";
import {OrderService} from "../../../shared/services/order.service";
import {of} from "rxjs";
import {GetCustomerDetail} from "../../../shared/state/actions/customer.action";
import {GetOrderByID} from "../../../shared/state/actions/order.action";

describe('OrderDetailComponent', () => {
    let component: OrderDetailComponent;
    let fixture: ComponentFixture<OrderDetailComponent>;
    let store: Store;
    let orderService: OrderService;
    let formBuilder: FormBuilder;

    beforeEach(() => {
        const activatedRouteStub = () => ({
            snapshot: {paramMap: {get: () => ({})}}
        });
        const toastrServiceStub = () => ({
            success: string => ({}),
            error: (string, string1, object) => ({})
        });
        const routerStub = () => ({});
        const storeStub = () => ({dispatch: array => ({})});
        const formBuilderStub = () => ({});
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [OrderDetailComponent],
            imports: [NgxsModule.forRoot([OrderState]), RouterTestingModule, HttpClientModule, FormsModule, ReactiveFormsModule, MatFormFieldModule,
                MatInputModule, MatAutocompleteModule, MatSelectModule, BrowserAnimationsModule, MatChipsModule, HttpClientTestingModule],
            providers: [OrderService, HttpClient, FormBuilder,
                NgForm,
                {provide: ToastrService, useFactory: toastrServiceStub},]
        });
        fixture = TestBed.createComponent(OrderDetailComponent);
        component = fixture.componentInstance;
        orderService = TestBed.inject(OrderService);
        store = TestBed.inject(Store);
        formBuilder = TestBed.inject(FormBuilder);

        Object.defineProperty(component, 'orders$', {writable: true});

        component.orders$ = of({
                OrderDetail : {
                    "order_id": 8,
                    "status": "Completed",
                    "created_date": "2021-09-14T11:09:12.524",
                    "customer": {
                        "customer_id": 1,
                        "nation_number": "77364887738",
                        "first_name": "Maria",
                        "last_name": "Anders",
                        "is_active": true,
                        "customer_contact_dto_list": []
                    },
                    "order_details": [
                        {
                            "order_detail_id": 7,
                            "order_id": 8,
                            "product_id": 85,
                            "status": "Confirmed",
                            "product_name": "34534",
                            "product_price": 2,
                            "product_description": "345",
                            "product_short_description": "345",
                            "product_barcode": "345"
                        }
                    ]
                }
        })

        fixture.detectChanges();
    });

    it('can load instance', () => {
        expect(component).toBeTruthy();
    });

    it(`ordersTableColumns has default value`, () => {
        expect(component.ordersTableColumns).toEqual([
            'product_id',
            'product_name',
            'product_price',
            'product_short_description',
            'status',
            'cancel'
        ]);
    });

    it(`pendingStatus has default value`, () => {
        expect(component.pendingStatus).toEqual(0);
    });

    it(`completedStatus has default value`, () => {
        expect(component.completedStatus).toEqual(1);
    });

    it(`totalAmount has default value`, () => {
        expect(component.totalAmount).toEqual(2);
    });

    describe('ngOnInit', () => {
        it('makes expected calls', () => {

            spyOn(orderService, 'getOrderByID').and.callFake(function (value) {
                return of({

                        "success": true,
                        "id": 8,
                        "message": null,
                        "data": {
                            "order_id": 8,
                            "status": "Completed",
                            "created_date": "2021-09-14T11:09:12.524",
                            "customer": {
                                "customer_id": 1,
                                "nation_number": "77364887738",
                                "first_name": "Maria",
                                "last_name": "Anders",
                                "is_active": true,
                                "customer_contact_dto_list": []
                            },
                            "order_details": [
                                {
                                    "order_detail_id": 7,
                                    "order_id": 8,
                                    "product_id": 85,
                                    "status": "Confirmed",
                                    "product_name": "34534",
                                    "product_price": 2,
                                    "product_description": "345",
                                    "product_short_description": "345",
                                    "product_barcode": "345"
                                }
                            ]
                        }

                });
            });

            component.ngOnInit();
            component.store.dispatch(new GetOrderByID(8));
            const orderDetail = store.selectSnapshot(OrderState.getOrderByID);
            console.log("orderDetail", orderDetail);
            expect(orderDetail.OrderDetail).toBeTruthy();
        });
    });
});
