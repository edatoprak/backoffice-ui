/* eslint-disable @typescript-eslint/naming-convention */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FuseMediaWatcherService } from '../../../../@fuse/services/media-watcher';
import { NgxsModule, Store } from '@ngxs/store';
import { MainService } from '../../../shared/main.service';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductListComponent } from './product-list.component';
import { FilterState, ProductState } from '../../../shared/state/product.state';
import { CartState } from '../../../shared/state/cart.state';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import {
    AddProductToCart,
    GetCustomerCart,
} from '../../../shared/state/actions/cart.action';
import { GetProducts } from '../../../shared/state/actions/product.action';
import { CommonState } from '../../../shared/state/common.state';
import { ProductService } from '../../../shared/services/product.service';
import { CommonService } from '../../../shared/services/common.service';
import { GetCities } from '../../../shared/state/actions/common.action';
import { CartService } from '../../../shared/services/cart.service';

describe('ProductListComponent', () => {
    let component: ProductListComponent;
    let fixture: ComponentFixture<ProductListComponent>;
    let store: Store;
    let formBuilder: FormBuilder;
    let mainService: MainService;
    let commonService: CommonService;
    let productService: ProductService;
    let cartService: CartService;
    beforeEach(async () => {
        const changeDetectorRefStub = () => ({ markForCheck: () => ({}) });
        const matDialogStub = () => ({});
        const fuseMediaWatcherServiceStub = () => ({
            onMediaChange$: {
                pipe: () => ({
                    subscribe: (f) => f({ matchingAliases: ['lg'] }),
                }),
            },
        });
        const mainServiceStub = () => ({
            productGetAllRequest: {
                category_id: {},
                search_key: {},
                min_price: {},
                max_price: {},
                attribute_ids_collections: {},
            },
            saveProductFilter: {},
            selectedCustomer: { customer_id: {} },
        });
        const toastrServiceStub = () => ({
            success: (string) => ({}),
            error: (string, string1, object) => ({}),
        });
        await TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                FormsModule,
                ReactiveFormsModule,
                RouterTestingModule,
                NgxsModule.forRoot([ProductState, CartState, FilterState]),
            ],
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [ProductListComponent],
            providers: [
                {
                    provide: ChangeDetectorRef,
                    useFactory: changeDetectorRefStub,
                },
                { provide: MatDialog, useFactory: matDialogStub },
                {
                    provide: FuseMediaWatcherService,
                    useFactory: fuseMediaWatcherServiceStub,
                },
                FormBuilder,
                ProductService,
                CommonService,
                CartService,
                { provide: MainService, useFactory: mainServiceStub },
                { provide: ToastrService, useFactory: toastrServiceStub },
            ],
        }).compileComponents();
        store = TestBed.inject(Store);
        mainService = TestBed.inject(MainService);
        commonService = TestBed.inject(CommonService);
        productService = TestBed.inject(ProductService);
        cartService = TestBed.inject(CartService);
        fixture = TestBed.createComponent(ProductListComponent);
        component = fixture.componentInstance;
        formBuilder = TestBed.inject(FormBuilder);
        Object.defineProperty(component, 'attributes$', { writable: true });
        Object.defineProperty(component, 'addcart$', { writable: true });
        Object.defineProperty(component, 'categories$', { writable: true });
        Object.defineProperty(component, 'products$', { writable: true });
        Object.defineProperty(component, 'carts$', { writable: true });
        Object.defineProperty(component, 'filter$', { writable: true });
        component.attributes$ = of({
            Attributes: [
                {
                    attribute_id: 2,
                    attribute_title: 'Renk',
                    attribute_terms: [
                        {
                            attribute_term_id: 1,
                            attribute_value: 'Kırmızı',
                        },
                        {
                            attribute_term_id: 2,
                            attribute_value: 'Siyah',
                        },
                    ],
                },
                {
                    attribute_id: 4,
                    attribute_title: 'Marka',
                    attribute_terms: [
                        {
                            attribute_term_id: 3,
                            attribute_value: 'Samsung',
                        },
                        {
                            attribute_term_id: 4,
                            attribute_value: 'Apple',
                        },
                    ],
                },
                {
                    attribute_id: 8,
                    attribute_title: 'Bellek',
                    attribute_terms: [
                        {
                            attribute_term_id: 7,
                            attribute_value: '4GB',
                        },
                        {
                            attribute_term_id: 8,
                            attribute_value: '8GB',
                        },
                    ],
                },
                {
                    attribute_id: 10,
                    attribute_title: 'Fiyat',
                    attribute_terms: [
                        {
                            attribute_term_id: 10,
                            attribute_value: 'min',
                        },
                        {
                            attribute_term_id: 11,
                            attribute_value: 'max',
                        },
                    ],
                },
            ],
        });
        component.addcart$ = of({
            order_id: 38,
            status: 'Waiting',
            created_date: '2021-10-07T13:14:36.322',
            customer: {
                customer_id: 121,
                nation_number: '33399922277',
                first_name: 'Eda',
                last_name: 'Eren',
                is_active: true,
                customer_contact_dto_list: [
                    {
                        customer_contact_id: 53,
                        customer_id: 121,
                        country_id: null,
                        city_id: null,
                        district_id: null,
                        country_name: null,
                        city_name: null,
                        district_name: null,
                        contact_type: 'Address',
                        contact_value: 'Önder Mh 1321 sok.',
                        contact_description: 'Ev Adresi',
                        is_active: true,
                    },
                    {
                        customer_contact_id: 54,
                        customer_id: 121,
                        country_id: null,
                        city_id: null,
                        district_id: null,
                        country_name: null,
                        city_name: null,
                        district_name: null,
                        contact_type: 'Address',
                        contact_value: 'Bilkent Cyberpark C blok',
                        contact_description: 'İş Adresi',
                        is_active: true,
                    },
                    {
                        customer_contact_id: 55,
                        customer_id: 121,
                        country_id: null,
                        city_id: null,
                        district_id: null,
                        country_name: null,
                        city_name: null,
                        district_name: null,
                        contact_type: 'Phone_Number',
                        contact_value: '05552221777',
                        contact_description: 'Cep Telefonu',
                        is_active: true,
                    },
                ],
            },
            order_details: [
                {
                    order_detail_id: 70,
                    order_id: 38,
                    product_id: 88,
                    status: 'Confirmed',
                    product_name: 'imac',
                    product_price: 33333.0,
                    product_description: 'imac pc',
                    product_short_description: 'imac pc',
                    product_barcode: '222222',
                },
            ],
        });
        component.categories$ = of({ Categories: [] });
        component.products$ = of({
            Products: [],
            Pagination: {
                length: 0,
                page: 0,
                size: 0,
            },
        });
        component.carts$ = of({
            order_id: 38,
            status: 'Waiting',
            created_date: '2021-10-07T13:14:36.322',
            customer: {
                customer_id: 121,
                nation_number: '33399922277',
                first_name: 'Eda',
                last_name: 'Eren',
                is_active: true,
                customer_contact_dto_list: [
                    {
                        customer_contact_id: 53,
                        customer_id: 121,
                        country_id: null,
                        city_id: null,
                        district_id: null,
                        country_name: null,
                        city_name: null,
                        district_name: null,
                        contact_type: 'Address',
                        contact_value: 'Önder Mh 1321 sok.',
                        contact_description: 'Ev Adresi',
                        is_active: true,
                    },
                    {
                        customer_contact_id: 54,
                        customer_id: 121,
                        country_id: null,
                        city_id: null,
                        district_id: null,
                        country_name: null,
                        city_name: null,
                        district_name: null,
                        contact_type: 'Address',
                        contact_value: 'Bilkent Cyberpark C blok',
                        contact_description: 'İş Adresi',
                        is_active: true,
                    },
                    {
                        customer_contact_id: 55,
                        customer_id: 121,
                        country_id: null,
                        city_id: null,
                        district_id: null,
                        country_name: null,
                        city_name: null,
                        district_name: null,
                        contact_type: 'Phone_Number',
                        contact_value: '05552221777',
                        contact_description: 'Cep Telefonu',
                        is_active: true,
                    },
                ],
            },
            order_details: [
                {
                    order_detail_id: 70,
                    order_id: 38,
                    product_id: 88,
                    status: 'Confirmed',
                    product_name: 'imac',
                    product_price: 33333.0,
                    product_description: 'imac pc',
                    product_short_description: 'imac pc',
                    product_barcode: '222222',
                },
            ],
        });
        component.filterform = formBuilder.group({
            minPrice: new FormControl(''),
            maxPrice: new FormControl(''),
            alls: new FormArray([]),
            colors: new FormArray([]),
            brands: new FormArray([]),
            rams: new FormArray([]),
        });
        fixture.detectChanges();
    });
    it('can load instance', () => {
        expect(component).toBeTruthy();
    });
    it(`cartcount has default value`, () => {
        expect(component.cartcount).toEqual(1);
    });
    it(`drawerMode has default value`, () => {
        expect(component.drawerMode).toEqual(`side`);
    });
    it(`drawerOpened has default value`, () => {
        expect(component.drawerOpened).toEqual(true);
    });
    it(`masonryColumns has default value`, () => {
        expect(component.masonryColumns).toEqual(4);
    });
    it(`attributes has default value`, () => {
        expect(component.attributes).toEqual([]);
    });
    it(`allcolors has default value`, () => {
        expect(component.allcolors.length).toEqual(8);
    });
    describe('addAttr', () => {
        it('makes expected vals', () => {
            component.addAttr(1, 2, 3);
            expect(
                (<FormArray>component.filterform.controls['alls']).length
            ).toEqual(7);
        });
    });
    describe('getcolor', () => {
        it('makes expected vals', () => {
            expect(component.getcolor('Beyaz')).toEqual('bg-white');
        });
    });
    it('makes expected calls for addCart', () => {
        spyOn(cartService, 'addToCart').and.callFake(function (value) {
            return of({
                data: {
                    created_date: '',
                    customer: {
                        customer_contact_dto_list: [],
                        customer_id: 0,
                        first_name: '',
                        is_active: true,
                        last_name: '',
                        nation_number: '',
                    },
                    order_details: [
                        {
                            order_detail_id: 1,
                            order_id: 0,
                            product_id: 0,
                            product_name: '',
                            product_price: 0,
                            status: '',
                        },
                    ],
                    order_id: 0,
                    status: '',
                },
            });
        });
        component.addCart(1);
        const addProduct = store.selectSnapshot(CartState.addProductToCart);
        expect(addProduct.order_details.length).toEqual(1);
    });
    describe('filtered', () => {
        it('makes expected calls', () => {
            component.addAttr(1, 2, 3);
            (<FormArray>component.filterform.get('alls'))
                .at(0)
                .get('ispick')
                .setValue(true);
            component.filtered();
            expect(
                component.mainService.productGetAllRequest
                    .attribute_ids_collections
            ).toEqual([[1]]);
        });
    });
    describe('removeFArr', () => {
        it('makes expected calls', () => {
            const formArrayStub: FormArray = new FormArray([
                new FormControl(''),
            ]);
            spyOn(formArrayStub, 'removeAt').and.callThrough();
            component.removeFArr(formArrayStub);
            expect(formArrayStub.removeAt).toHaveBeenCalled();
        });
        it('makes expected remove', () => {
            const formArrayStub: FormArray = new FormArray([
                new FormControl(''),
            ]);
            formArrayStub.at(0).setValue('1');
            component.removeFArr(formArrayStub);
            expect(formArrayStub.length).toEqual(0);
        });
    });
    describe('pageing', () => {
        it('makes expected calls', () => {
            component.pageing({ pageIndex: 1 });
            expect(component.mainService.productGetAllRequest.page).toEqual(1);
        });
    });
    it('makes expected search_key', async () => {
        component.filterByQuery('search_key', '1');
        expect(component.mainService.productGetAllRequest.search_key).toEqual(
            '1'
        );
    });
    it('makes expected category_name', async () => {
        component.filter$.next({ param: 'category_name', val: 1 });
        expect(component.mainService.productGetAllRequest.category_id).toEqual(
            1
        );
    });
    it('makes expected max_price', async () => {
        component.filterform.get('maxPrice').setValue(1);
        expect(component.mainService.productGetAllRequest.max_price).toEqual(1);
    });
    it('makes expected min_price', async () => {
        component.filterform.get('minPrice').setValue(1);
        expect(component.mainService.productGetAllRequest.min_price).toEqual(1);
    });
    describe('trackByFn', () => {
        it('makes expected calls', () => {
            expect(component.trackByFn(1, { id: 1 })).toEqual(1);
        });
    });
    describe('ngOnInit', () => {
        it('makes expected calls', () => {
            spyOn(cartService, 'addToCart').and.callFake(function (value) {
                return of({
                    success: true,
                    id: null,
                    message: null,
                    data: {
                        order_id: 38,
                        status: 'Waiting',
                        created_date: '2021-10-07T13:14:36.322',
                        customer: {
                            customer_id: 121,
                            nation_number: '33399922277',
                            first_name: 'Eda',
                            last_name: 'Eren',
                            is_active: true,
                            customer_contact_dto_list: [
                                {
                                    customer_contact_id: 53,
                                    customer_id: 121,
                                    country_id: null,
                                    city_id: null,
                                    district_id: null,
                                    country_name: null,
                                    city_name: null,
                                    district_name: null,
                                    contact_type: 'Address',
                                    contact_value: 'Önder Mh 1321 sok.',
                                    contact_description: 'Ev Adresi',
                                    is_active: true,
                                },
                                {
                                    customer_contact_id: 54,
                                    customer_id: 121,
                                    country_id: null,
                                    city_id: null,
                                    district_id: null,
                                    country_name: null,
                                    city_name: null,
                                    district_name: null,
                                    contact_type: 'Address',
                                    contact_value: 'Bilkent Cyberpark C blok',
                                    contact_description: 'İş Adresi',
                                    is_active: true,
                                },
                                {
                                    customer_contact_id: 55,
                                    customer_id: 121,
                                    country_id: null,
                                    city_id: null,
                                    district_id: null,
                                    country_name: null,
                                    city_name: null,
                                    district_name: null,
                                    contact_type: 'Phone_Number',
                                    contact_value: '05552221777',
                                    contact_description: 'Cep Telefonu',
                                    is_active: true,
                                },
                            ],
                        },
                        order_details: [
                            {
                                order_detail_id: 70,
                                order_id: 38,
                                product_id: 88,
                                status: 'Confirmed',
                                product_name: 'imac',
                                product_price: 33333.0,
                                product_description: 'imac pc',
                                product_short_description: 'imac pc',
                                product_barcode: '222222',
                            },
                        ],
                    },
                });
            });
            component.store.dispatch(
                new AddProductToCart({ customer_id: 121, product_id: 1 })
            );
            component.ngOnInit();
            expect(
                component.store.selectSnapshot(CartState.getCustomerCart)
            ).toBeTruthy();
        });
    });
});
