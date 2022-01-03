import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CustomerDetailComponent} from './customer-detail.component';
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {NgxsModule, Store} from "@ngxs/store";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {FormArray, FormBuilder, FormsModule, NgForm, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatSelectModule} from "@angular/material/select";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatChipsModule} from "@angular/material/chips";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {CustomerState} from "../../../shared/state/customer.state";
import {CommonService} from "../../../shared/services/common.service";
import {ToastrService} from "ngx-toastr";
import {CustomerService} from "../../../shared/services/customer.service";
import {of} from "rxjs";
import {UserUpdate} from "../../../shared/state/actions/user.action";
import {UserState} from "../../../shared/state/user.state";
import {GetCustomerDetail, UpdateCustomerDetail} from "../../../shared/state/actions/customer.action";
import {CommonState} from "../../../shared/state/common.state";
import {GetAttributes} from "../../../shared/state/actions/product.action";

describe('CustomerDetailComponent', () => {
    let component: CustomerDetailComponent;
    let fixture: ComponentFixture<CustomerDetailComponent>;
    let store: Store;
    let customerService: CustomerService;
    let formBuilder: FormBuilder;

    beforeEach(async () => {
        const toastrServiceStub = () => ({
            success: string => ({}),
            error: (string, string1, object) => ({})
        });
        await TestBed.configureTestingModule({
            declarations: [CustomerDetailComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [NgxsModule.forRoot([CustomerState]), RouterTestingModule, HttpClientModule, FormsModule, ReactiveFormsModule, MatFormFieldModule,
                MatInputModule, MatAutocompleteModule, MatSelectModule, BrowserAnimationsModule, MatChipsModule, HttpClientTestingModule],
            providers: [CustomerService, CommonService, HttpClient, FormBuilder,
                NgForm,
                {provide: ToastrService, useFactory: toastrServiceStub},]
        })
        fixture = TestBed.createComponent(CustomerDetailComponent);
        component = fixture.componentInstance;
        customerService = TestBed.inject(CustomerService);
        store = TestBed.inject(Store);
        formBuilder = TestBed.inject(FormBuilder);

        Object.defineProperty(component, 'customers$', {writable: true});
        component.customers$ = of({
            CustomerDetail: {
                "customer_id": 121,
                "nation_number": "33399922277",
                "first_name": "Eda",
                "last_name": "Toprak",
                "is_active": true,
                "customer_contact_dto_list": [
                    {
                        "customer_contact_id": 53,
                        "customer_id": null,
                        "country_id": null,
                        "city_id": null,
                        "district_id": null,
                        "country_name": null,
                        "city_name": null,
                        "district_name": null,
                        "contact_type": "Address",
                        "contact_value": "Önder Mh 1321 sok.",
                        "contact_description": "Ev Adresi",
                        "is_active": true
                    },
                    {
                        "customer_contact_id": 54,
                        "customer_id": null,
                        "country_id": null,
                        "city_id": null,
                        "district_id": null,
                        "country_name": null,
                        "city_name": null,
                        "district_name": null,
                        "contact_type": "Address",
                        "contact_value": "Bilkent Cyberpark C blok",
                        "contact_description": "İş Adresi",
                        "is_active": true
                    },
                    {
                        "customer_contact_id": 55,
                        "customer_id": null,
                        "country_id": null,
                        "city_id": null,
                        "district_id": null,
                        "country_name": null,
                        "city_name": null,
                        "district_name": null,
                        "contact_type": "Phone_Number",
                        "contact_value": "05552221777",
                        "contact_description": "Cep Telefonu",
                        "is_active": true
                    }
                ]
            }
        })

        component.customerForm = formBuilder.group({
            customers: new FormArray([]),
            phoneNumbers: new FormArray([]),
            emails: new FormArray([]),
            address: new FormArray([]),
        })

        fixture.detectChanges();
    });


    it('should create', () => {
        expect(component).toBeTruthy();
    });
    describe('ngOnInit', () => {
        it('makes expected calls', () => {
            component.ngOnInit();

            spyOn(customerService, 'getCustomerDetail').and.callFake(function (value) {
                return of({
                    "success": true,
                    "id": null,
                    "message": null,
                    "data": {
                        "customer_id": 121,
                        "nation_number": "33399922277",
                        "first_name": "Eda",
                        "last_name": "Toprak",
                        "is_active": true,
                        "customer_contact_dto_list": [
                            {
                                "customer_contact_id": 53,
                                "customer_id": null,
                                "country_id": null,
                                "city_id": null,
                                "district_id": null,
                                "country_name": null,
                                "city_name": null,
                                "district_name": null,
                                "contact_type": "Address",
                                "contact_value": "Önder Mh 1321 sok.",
                                "contact_description": "Ev Adresi",
                                "is_active": true
                            },
                            {
                                "customer_contact_id": 54,
                                "customer_id": null,
                                "country_id": null,
                                "city_id": null,
                                "district_id": null,
                                "country_name": null,
                                "city_name": null,
                                "district_name": null,
                                "contact_type": "Address",
                                "contact_value": "Bilkent Cyberpark C blok",
                                "contact_description": "İş Adresi",
                                "is_active": true
                            },
                            {
                                "customer_contact_id": 55,
                                "customer_id": null,
                                "country_id": null,
                                "city_id": null,
                                "district_id": null,
                                "country_name": null,
                                "city_name": null,
                                "district_name": null,
                                "contact_type": "Phone_Number",
                                "contact_value": "05552221777",
                                "contact_description": "Cep Telefonu",
                                "is_active": true
                            }
                        ]
                    }
                });
            });

            component.updateCustomer();
            component.store.dispatch(new GetCustomerDetail(40));
            const customerDetail = store.selectSnapshot(CustomerState.getCustomerDetailList);
            console.log("customerDetail", customerDetail);
            expect(customerDetail.CustomerDetail).toBeTruthy();

            const customerInfo = formBuilder.group({
                "customer_id": 40,
                "nation_number": "67780760792",
                "first_name": "Daniel",
                "last_name": "Tonini",
            });
            (component.customerForm.get('customers') as FormArray).push(customerInfo);
        })
    });

    describe('updateCustomer', () => {
        it('makes expected calls', () => {

            const address = formBuilder.group({
                contact_value: "İş",
                contact_description: "İş",
                contact_type: "Address",
                is_default: true,
                country_id: 1,
                district_id: 416,
                city_id: 34,
                customer_contact_id: 40,
                customer_id: 25
            });

            (component.customerForm.get('address') as FormArray).push(address)

            const phoneNumber = formBuilder.group({
                contact_value: "İş",
                contact_description: "İş",
                contact_type: "Phone_Number",
                is_default: true,
                country_id: 1,
                district_id: 416,
                city_id: 34,
                customer_contact_id: 40,
                customer_id: 25
            });

            (component.customerForm.get('phoneNumbers') as FormArray).push(phoneNumber)


            spyOn(customerService, 'updateCustomerContacts').and.callFake(function (value) {
                return of({
                    "id": 40,
                    "message": "Kullanıcı güncellendi",
                    "success": true
                });
            });

                component.store.dispatch(new UpdateCustomerDetail({
                    customer_contact_update_dto_list: [{
                        "city_id": 34,
                        "contact_description": "İş",
                        "contact_type": "Address",
                        "contact_value": "Ataşehir",
                        "country_id": 1,
                        "customer_contact_id": 88,
                        "district_id": 416,
                        "is_active": true,
                        "is_default": true
                    }]
                }));
                component.updateCustomer();
                expect(component.store.selectSnapshot(CustomerState.updateCustomerDetailList)).toBeTruthy();


        });
    });
});
