import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CartComponent} from './cart.component';
import {ToastrService} from "ngx-toastr";
import {NgxsModule, Select, Store} from "@ngxs/store";
import {ActivatedRoute, convertToParamMap, Router} from "@angular/router";
import {MainService} from "../../shared/main.service";
import {HttpClient, HttpClientModule, HttpHandler} from "@angular/common/http";
import {CartState} from "../../shared/state/cart.state";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {ChangeDetectorRef, ErrorHandler, NO_ERRORS_SCHEMA} from "@angular/core";
import {autoSpy} from "../../../../auto-spy";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonService} from "../../shared/services/common.service";
import {ProductService} from "../../shared/services/product.service";
import {CartService} from "../../shared/services/cart.service";
import {MatSelectModule} from "@angular/material/select";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FilterState, ProductState} from "../../shared/state/product.state";
import {MatDialog} from "@angular/material/dialog";
import {FuseMediaWatcherService} from "../../../@fuse/services/media-watcher";
import {ProductDetComponent} from "../product/product-det/product-det.component";
import {Observable, of} from "rxjs";
import {CustomerCartStateModel} from "../../shared/state/models/cart";
import {GetAttributes, GetProductByID} from "../../shared/state/actions/product.action";
import {GetCustomerCart} from "../../shared/state/actions/cart.action";

describe('CartComponent', () => {
    let component: CartComponent;
    let toastrService: ToastrService;
    let fixture: ComponentFixture<CartComponent>;
    let store: Store;
    let formBuilder: FormBuilder;
    let mainService: MainService;
    let commonService: CommonService;
    let productService: ProductService;
    let cartService: CartService;
    interface MockFile {
        name: string;
        body: string;
        mimeType: string;
    }
    const createFileFromMockFile = (file: MockFile): File => {
        const blob = new Blob([file.body], {type: file.mimeType}) as any;
        blob['lastModifiedDate'] = new Date();
        blob['name'] = file.name;
        return blob as File;
    };
    const createMockFileList = (files: MockFile[]) => {
        const fileList: FileList = {
            length: files.length,
            item(index: number): File {
                return fileList[index];
            }
        };
        files.forEach((file, index) => fileList[index] = createFileFromMockFile(file));

        return fileList;
    };
    beforeEach(async () => {
        const changeDetectorRefStub = () => ({markForCheck: () => ({})});
        const matDialogStub = () => ({});
        const fuseMediaWatcherServiceStub = () => ({
            onMediaChange$: {pipe: () => ({subscribe: f => f({matchingAliases: ['lg']})})}
        });
        const mainServiceStub = () => ({
            productGetAllRequest: {
                category_id: {},
                search_key: {},
                min_price: {},
                max_price: {},
                attribute_ids_collections: {}
            },
            saveProductFilter: {},
            selectedCustomer: {customer_id: {}}
        });
        const toastrServiceStub = () => ({
            success: string => ({}),
            error: (string, string1, object) => ({})
        });
        await TestBed.configureTestingModule({
            imports: [HttpClientModule, FormsModule, ReactiveFormsModule,
                MatSelectModule, RouterTestingModule, MatAutocompleteModule, MatSelectModule,
                MatFormFieldModule, MatInputModule, BrowserAnimationsModule,
                NgxsModule.forRoot([ProductState, CartState, FilterState])],
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [CartComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap: convertToParamMap({id: 1})
                        }
                    }
                },
                {provide: ChangeDetectorRef, useFactory: changeDetectorRefStub},
                {provide: MatDialog, useFactory: matDialogStub},
                {
                    provide: FuseMediaWatcherService,
                    useFactory: fuseMediaWatcherServiceStub
                },
                FormBuilder, ProductService, CommonService, CartService,
                {provide: MainService, useFactory: mainServiceStub},
                {provide: ToastrService, useFactory: toastrServiceStub}
            ]
        }).compileComponents();
        store = TestBed.inject(Store);
        mainService = TestBed.inject(MainService);
        commonService = TestBed.inject(CommonService);
        productService = TestBed.inject(ProductService);
        cartService = TestBed.inject(CartService);
        fixture = TestBed.createComponent(CartComponent);
        component = fixture.componentInstance;
        formBuilder = TestBed.inject(FormBuilder);
        Object.defineProperty(component, 'carts$', {writable: true});
        component.carts$ = of({
                "order_id":38,
                "status":"Waiting",
                "created_date":"2021-10-07T13:14:36.322",
                "customer":
                    {"customer_id":121,"nation_number":"33399922277","first_name":"Eda","last_name":"Toprak","is_active":true,
                        "customer_contact_dto_list":[
                            {"customer_contact_id":53,"customer_id":121,"country_id":null,"city_id":null,"district_id":null,"country_name":null,"city_name":null,"district_name":null,"contact_type":"Address","contact_value":"Önder Mh 1321 sok.","contact_description":"Ev Adresi","is_active":true},
                            {"customer_contact_id":54,"customer_id":121,"country_id":null,"city_id":null,"district_id":null,"country_name":null,"city_name":null,"district_name":null,"contact_type":"Address","contact_value":"Bilkent Cyberpark C blok","contact_description":"İş Adresi","is_active":true},
                            {"customer_contact_id":55,"customer_id":121,"country_id":null,"city_id":null,"district_id":null,"country_name":null,"city_name":null,"district_name":null,"contact_type":"Phone_Number","contact_value":"05552221777","contact_description":"Cep Telefonu","is_active":true}]},
                "order_details":[
                    {"order_detail_id":70,"order_id":38,"product_id":88,"status":"Confirmed",
                        "product_name":"imac","product_price":33333.0,"product_description":"imac pc",
                        "product_short_description":"imac pc","product_barcode":"222222"}]

        });
    });
    describe('ngOnInit', () => {
        it('makes expected calls1', () => {
            component.mainservice.selectedCustomer.customer_id=121;
            spyOn(cartService, 'getCustomerCart').and
                .callFake(function (value) {
                    return of({
                        "success": true,
                        "id": null,
                        "message": null,
                        "data": {
                            "order_id":38,
                            "status":"Waiting",
                            "created_date":"2021-10-07T13:14:36.322",
                            "customer":
                                {"customer_id":121,"nation_number":"33399922277","first_name":"Eda","last_name":"Toprak","is_active":true,
                                    "customer_contact_dto_list":[
                                        {"customer_contact_id":53,"customer_id":121,"country_id":null,"city_id":null,"district_id":null,"country_name":null,"city_name":null,"district_name":null,"contact_type":"Address","contact_value":"Önder Mh 1321 sok.","contact_description":"Ev Adresi","is_active":true},
                                        {"customer_contact_id":54,"customer_id":121,"country_id":null,"city_id":null,"district_id":null,"country_name":null,"city_name":null,"district_name":null,"contact_type":"Address","contact_value":"Bilkent Cyberpark C blok","contact_description":"İş Adresi","is_active":true},
                                        {"customer_contact_id":55,"customer_id":121,"country_id":null,"city_id":null,"district_id":null,"country_name":null,"city_name":null,"district_name":null,"contact_type":"Phone_Number","contact_value":"05552221777","contact_description":"Cep Telefonu","is_active":true}]},
                            "order_details":[
                                {"order_detail_id":70,"order_id":38,"product_id":88,"status":"Confirmed","product_name":"imac","product_price":33333.0,"product_description":"imac pc","product_short_description":"imac pc","product_barcode":"222222"}]}
                    });
                });
            component.getCart();
            expect(component.store.selectSnapshot(CartState.getCustomerCart)).toBeTruthy();
        });
        it('makes expected calls1', () => {
            component.mainservice.selectedCustomer.customer_id=0;
            spyOn(cartService, 'getCustomerCart').and
                .callFake(function (value) {
                    return of({
                        "success": true,
                        "id": null,
                        "message": null,
                        "data": {
                            "order_id":38,
                            "status":"Waiting",
                            "created_date":"2021-10-07T13:14:36.322",
                            "customer":
                                {"customer_id":121,"nation_number":"33399922277","first_name":"Eda","last_name":"Toprak","is_active":true,
                                    "customer_contact_dto_list":[
                                        {"customer_contact_id":53,"customer_id":121,"country_id":null,"city_id":null,"district_id":null,"country_name":null,"city_name":null,"district_name":null,"contact_type":"Address","contact_value":"Önder Mh 1321 sok.","contact_description":"Ev Adresi","is_active":true},
                                        {"customer_contact_id":54,"customer_id":121,"country_id":null,"city_id":null,"district_id":null,"country_name":null,"city_name":null,"district_name":null,"contact_type":"Address","contact_value":"Bilkent Cyberpark C blok","contact_description":"İş Adresi","is_active":true},
                                        {"customer_contact_id":55,"customer_id":121,"country_id":null,"city_id":null,"district_id":null,"country_name":null,"city_name":null,"district_name":null,"contact_type":"Phone_Number","contact_value":"05552221777","contact_description":"Cep Telefonu","is_active":true}]},
                            "order_details":[
                                {"order_detail_id":70,"order_id":38,"product_id":88,"status":"Confirmed","product_name":"imac","product_price":33333.0,"product_description":"imac pc","product_short_description":"imac pc","product_barcode":"222222"}]}
                    });
                });
            component.getCart();
            expect(component.store.selectSnapshot(CartState.getCustomerCart)).toBeTruthy();
        });
        it('makes expected calls2', () => {
            spyOn(cartService, 'getCustomerCart').and
                .callFake(function (value) {
                    return of({
                        "success": true,
                        "id": null,
                        "message": null,
                        "data": {
                            "order_id":38,
                            "status":"Waiting",
                            "created_date":"2021-10-07T13:14:36.322",
                            "customer":
                                {"customer_id":121,"nation_number":"33399922277","first_name":"Eda","last_name":"Toprak","is_active":true,
                                    "customer_contact_dto_list":[
                                        {"customer_contact_id":53,"customer_id":121,"country_id":null,"city_id":null,"district_id":null,"country_name":null,"city_name":null,"district_name":null,"contact_type":"Address","contact_value":"Önder Mh 1321 sok.","contact_description":"Ev Adresi","is_active":true},
                                        {"customer_contact_id":54,"customer_id":121,"country_id":null,"city_id":null,"district_id":null,"country_name":null,"city_name":null,"district_name":null,"contact_type":"Address","contact_value":"Bilkent Cyberpark C blok","contact_description":"İş Adresi","is_active":true},
                                        {"customer_contact_id":55,"customer_id":121,"country_id":null,"city_id":null,"district_id":null,"country_name":null,"city_name":null,"district_name":null,"contact_type":"Phone_Number","contact_value":"05552221777","contact_description":"Cep Telefonu","is_active":true}]},
                            "order_details":[
                                {"order_detail_id":70,"order_id":38,"product_id":88,"status":"Confirmed","product_name":"imac","product_price":33333.0,"product_description":"imac pc","product_short_description":"imac pc","product_barcode":"222222"}]}
                    });
                });
            component.ngOnInit();
            expect(component.store.selectSnapshot(CartState.getCustomerCart)).toBeTruthy();
        });
        it('makes expected calls3', () => {
            component.mainservice.selectedCustomer.customer_id=121;
            component.mainservice.cartset=true;
            spyOn(cartService, 'getCustomerCart').and
                .callFake(function (value) {
                    return of({
                        "success": true,
                        "id": null,
                        "message": null,
                        "data": {
                            "order_id":38,
                            "status":"Waiting",
                            "created_date":"2021-10-07T13:14:36.322",
                            "customer":
                                {"customer_id":121,"nation_number":"33399922277","first_name":"Eda","last_name":"Toprak","is_active":true,
                                    "customer_contact_dto_list":[
                                        {"customer_contact_id":53,"customer_id":121,"country_id":null,"city_id":null,"district_id":null,"country_name":null,"city_name":null,"district_name":null,"contact_type":"Address","contact_value":"Önder Mh 1321 sok.","contact_description":"Ev Adresi","is_active":true},
                                        {"customer_contact_id":54,"customer_id":121,"country_id":null,"city_id":null,"district_id":null,"country_name":null,"city_name":null,"district_name":null,"contact_type":"Address","contact_value":"Bilkent Cyberpark C blok","contact_description":"İş Adresi","is_active":true},
                                        {"customer_contact_id":55,"customer_id":121,"country_id":null,"city_id":null,"district_id":null,"country_name":null,"city_name":null,"district_name":null,"contact_type":"Phone_Number","contact_value":"05552221777","contact_description":"Cep Telefonu","is_active":true}]},
                            "order_details":[
                                {"order_detail_id":70,"order_id":38,"product_id":88,"status":"Confirmed","product_name":"imac","product_price":33333.0,"product_description":"imac pc","product_short_description":"imac pc","product_barcode":"222222"}]}
                    });
                });
            component.ngOnInit();
            expect(component.store.selectSnapshot(CartState.getCustomerCart)).toBeTruthy();
        });
    });
    describe('RemoveProductFromCart', () => {
        it('makes expected calls', () => {
            spyOn(cartService, 'RemoveProductFromCart').and
                .callFake(function (value) {
                    return of({
                        "success": true,
                        "id": null,
                        "message": null
                    });
                });
            component.RemoveProductFromCart({order_detail_id:1});
            expect(component.store.selectSnapshot(CartState.getCustomerCart)).toBeTruthy();
        });
    });
    describe('UpdateCart', () => {
        it('makes expected calls', () => {
            spyOn(cartService, 'updateOrder').and
                .callFake(function (value) {
                    return of({
                        "success": true,
                        "id": null,
                        "message": null
                    });
                });
            component.UpdateCart("Waiting", 1);
            expect(component.mainservice.selectedCustomer).toEqual(null);
        });
    });
    describe('trackByFn', () => {
        it('makes expected calls', () => {
            expect(component.trackByFn(1, {id: 1})).toEqual(1);
        });
    });
});
