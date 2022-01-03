import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ListComponent} from './list.component';
import {NgxsModule, Store} from "@ngxs/store";
import {RouterTestingModule} from "@angular/router/testing";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatSidenavModule} from "@angular/material/sidenav";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {HttpClient, HttpHandler} from "@angular/common/http";
import {CustomerService} from "../../../shared/services/customer.service";
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {CustomerState} from 'app/shared/state/customer.state';
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {of} from "rxjs";
import {GetCustomers} from "../../../shared/state/actions/customer.action";

describe('ListComponent', () => {
    let component: ListComponent;
    let fixture: ComponentFixture<ListComponent>;
    let store: Store;
    let customerService: CustomerService;
    let formBuilder: FormBuilder;
    let superNgOnDestroy;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ListComponent],
            imports: [NgxsModule.forRoot([CustomerState]), FormsModule, ReactiveFormsModule, RouterTestingModule, BrowserAnimationsModule, MatSidenavModule, HttpClientTestingModule],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [CustomerService, HttpClient, HttpHandler]
        })
        customerService = TestBed.inject(CustomerService);
        store = TestBed.inject(Store);
        fixture = TestBed.createComponent(ListComponent);
        component = fixture.componentInstance;
        formBuilder = TestBed.inject(FormBuilder);
        superNgOnDestroy = spyOn(ListComponent.prototype, 'ngOnDestroy')

        Object.defineProperty(component, 'customers$', {writable: true});

        component.customers$ = of()
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(`isLoading has default value`, () => {
        expect(component.isLoading).toEqual(false);
    });

    it(`customersCount has default value`, () => {
        expect(component.customersCount).toEqual(0);
    });

    it(`drawerMode has default value`, () => {
        expect(component.drawerMode).toEqual(`side`);
    });

    it(`customersTableColumns has default value`, () => {
        expect(component.customersTableColumns).toEqual([
            `customer_id`,
            `nation_number`,
            `first_name`,
            `last_name`
        ]);
    });

    it(`searchInput has default value`, () => {
        expect(component.searchInput).toEqual(false);
    });

    it('paging', () => {
        spyOn(customerService, 'getAllCustomers').and.callFake(function (value) {
            return of({
                "success": true,
                "id": null,
                "message": null,
                "data": {
                    "content": [
                        {
                            "customer_id": 143,
                            "nation_number": "36598628888",
                            "first_name": "Test",
                            "last_name": "Test",
                            "is_active": true
                        },
                    ],
                    "page": 0,
                    "size": 30,
                    "total_elements": 113,
                    "total_pages": 4,
                    "last": false
                }
            });
        })
        component.paging({value: 0})
        const customerList = store.selectSnapshot(CustomerState.getCustomerList);
        console.log("customerList", customerList);
        expect(customerList.Customers).toBeTruthy();
    });

    describe('trackByFn', () => {
        it('makes expected calls', () => {
            expect(component.trackByFn(1, {id: 1})).toEqual(1);
        });
    });

    it('should destroy component', () => {
        component.ngOnDestroy();
    });

    describe('ngOnInit', () => {
        it('makes expected calls', () => {
            spyOn(customerService, 'getAllCustomers').and
                .callFake(function (value) {
                    return of({
                        "success": true,
                        "id": null,
                        "message": null,
                        "data": {
                            "content": [
                                {
                                    "customer_id": 143,
                                    "nation_number": "36598628888",
                                    "first_name": "Test",
                                    "last_name": "Test",
                                    "is_active": true
                                },
                            ],
                            "page": 0,
                            "size": 30,
                            "total_elements": 113,
                            "total_pages": 4,
                            "last": false
                        }
                    })
                });
            component.store.dispatch(new GetCustomers({
                page: 0,
                order: 'asc',
                size: 5,
                searchKey: '',
                sort: ''
            }));
            component.ngOnInit();
            expect(component.store.selectSnapshot(CustomerState.getCustomerList)).toBeTruthy();
        })
    });

    describe('searchByQuery', () => {
        it('makes expected calls', () => {
            component.searchByQuery("test");
            component.searchInput = false;
            expect(component.searchInput).toBe(false);
            component.searchInput = true;
            expect(component.searchInput).toBe(true);

            spyOn(customerService, 'getAllCustomers').and
                .callFake(function (value) {
                    return of({
                        "success": true,
                        "id": null,
                        "message": null,
                        "data": {
                            "content": [
                                {
                                    "customer_id": 143,
                                    "nation_number": "36598628888",
                                    "first_name": "Test",
                                    "last_name": "Test",
                                    "is_active": true
                                },
                            ],
                            "page": 0,
                            "size": 30,
                            "total_elements": 113,
                            "total_pages": 4,
                            "last": false
                        }
                    })
                });
            component.store.dispatch(new GetCustomers({
                page: 0,
                order: 'asc',
                size: 5,
                searchKey: '',
                sort: ''
            }));
            component.ngOnInit();
            expect(component.store.selectSnapshot(CustomerState.getCustomerList)).toBeTruthy();
        })
    });


});
