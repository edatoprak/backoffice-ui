import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Select, Store} from "@ngxs/store";
import {CustomerState} from "../../../shared/state/customer.state";
import {Observable} from "rxjs";
import {CustomerDetailStateModel} from "../../../shared/state/models/customer";
import {CreateCustomer, GetCustomerDetail, UpdateCustomerDetail} from "../../../shared/state/actions/customer.action";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {skip} from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-customer-detail',
    templateUrl: './customer-detail.component.html',
    styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent implements OnInit {

    @Select(CustomerState.getCustomerDetailList)
    customers$: Observable<CustomerDetailStateModel>;

    customerForm: FormGroup;
    customer_id: number;

    constructor(public route: ActivatedRoute,
                public store: Store,
                public _formBuilder: FormBuilder,
                public toastr: ToastrService) {
    }

    ngOnInit(): void {
        this.customerForm = this._formBuilder.group({
            customers: new FormArray([]),
            phoneNumbers: new FormArray([]),
            emails: new FormArray([]),
            address: this._formBuilder.array([]),
        });


        this.store.dispatch([new GetCustomerDetail(this.route.snapshot.queryParams.state)]);


        this.customers$.subscribe((customer) => {
            if (customer.CustomerDetail) {
                this.customer_id = customer.CustomerDetail.customer_id
                const customerInfo = this._formBuilder.group({
                    first_name : customer.CustomerDetail.first_name,
                    last_name : customer.CustomerDetail.last_name,
                    nation_number : customer.CustomerDetail.nation_number,
                    customer_id : customer.CustomerDetail.customer_id
                });
                (this.customerForm.get('customers') as FormArray).push(customerInfo);

                customer.CustomerDetail.customer_contact_dto_list.forEach(detail => {

                    const contactDtoList = this._formBuilder.group({
                        country_name: detail.country_name,
                        city_name: detail.city_name,
                        district_name: detail.district_name,
                        contact_value: detail.contact_value,
                        contact_description: detail.contact_description,
                        contact_type: detail.contact_type,
                        is_default: true,
                        country_id: detail.country_id,
                        district_id: detail.district_id,
                        city_id: detail.city_id,
                        customer_contact_id: detail.customer_contact_id
                    });
                    if (detail.contact_type == "Address") {
                        (this.customerForm.get('address') as FormArray).push(contactDtoList);
                    } else if (detail.contact_type == "Phone_Number") {
                        (this.customerForm.get('phoneNumbers') as FormArray).push(contactDtoList);
                    }
                })
            }
        });
    }
    updateCustomer() {
        let form = this.customerForm.value;
        let contactDtoList = [];
        let addressInfo = this.customerForm.get('address').value;
        addressInfo.forEach(info => {
            contactDtoList.push({
                contact_value: info.contact_value,
                contact_description: info.contact_description,
                contact_type: info.contact_type,
                is_default: true,
                country_id: info.country_id,
                district_id: info.district_id,
                city_id: info.city_id,
                customer_contact_id: info.customer_contact_id,
                customer_id : this.customer_id
            })
        })
        let phoneInfo = this.customerForm.get('phoneNumbers').value;
        phoneInfo.forEach(info => {
            contactDtoList.push({
                contact_value: info.contact_value,
                contact_description: info.contact_description,
                contact_type: info.contact_type,
                is_default: true,
                country_id: info.country_id,
                district_id: info.district_id,
                city_id: info.city_id,
                customer_contact_id: info.customer_contact_id,
                customer_id: this.customer_id
            })
        })

        this.store.dispatch([new UpdateCustomerDetail({customer_contact_update_dto_list:contactDtoList})]).subscribe({
            next: () => {
                this.toastr.success('Müşteri bilgileri güncellendi');
            },
            error: ({error}) => {
                this.toastr.error('Güncelleme yapılamadı', 'Hata', {
                    timeOut: 3000,
                });
            }
        })
    }
}
