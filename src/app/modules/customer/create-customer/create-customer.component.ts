import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators, FormControl} from '@angular/forms';
import {Navigate} from '@ngxs/router-plugin';
import {Select, Store} from '@ngxs/store';
import {Observable, Subject} from 'rxjs';
import {CityStateModel, CountryStateModel, DistrictStateModel} from "../../../shared/state/models/common";
import {CommonState} from 'app/shared/state/common.state';
import {GetCities, GetCountries, GetDistricts} from "../../../shared/state/actions/common.action";
import {CreateCustomer} from 'app/shared/state/actions/customer.action';

@Component({
    selector: 'app-create-customer',
    templateUrl: './create-customer.component.html',
    styleUrls: ['./create-customer.component.scss'],
})
export class CreateCustomerComponent implements OnInit {

    customerForm: FormGroup;
    step2: FormGroup;
    @Select(CommonState.getCountryList)
    countries$: Observable<CountryStateModel>;

    @Select(CommonState.getCityList)
    cities$: Observable<CityStateModel>;

    @Select(CommonState.getDistrictList)
    districts$: Observable<DistrictStateModel>;

    selected = 1;

    constructor(
        public _formBuilder: FormBuilder,
        public store: Store,
        public _changeDetectorRef: ChangeDetectorRef,
    ) {
    }

    ngOnInit(): void {
        this.store.dispatch(new GetCountries())
        this.store.dispatch(new GetCities(1))
        this.customerForm = this._formBuilder.group({
            id: [''],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            natId: ['', Validators.required],
            birthday: [''],
            phoneNumbers: new FormArray([]),
            emails: new FormArray([]),
            address: this._formBuilder.array([]),
        });
        this.onAddress();
        this.onPhoneNumber();
        this.addEmailField();
    }

    onSubmit() {

        const form = this.customerForm.value;
        const request = {
            customer_contact_list: [...form.address, ...form.phoneNumbers],
            first_name: form.firstName,
            last_name: form.lastName,
            nation_number: form.natId
        }
        this.store.dispatch([new CreateCustomer(request)])
    }

    selectChangedCountry(event) {
        this.store.dispatch(new GetCities(event.value))
    }

    selectChangedCity(event) {
        this.store.dispatch(new GetDistricts(event.value))
    }

    onPhoneNumber() {
        const phoneFormGroup = this._formBuilder.group({
            country_id: [''],
            city_id: [''],
            district_id: [''],
            contact_value: [''],
            contact_description: [''],
            contact_type: ['Phone_Number'],
            is_default: true
        });

        (this.customerForm.get('phoneNumbers') as FormArray).push(phoneFormGroup);

        this._changeDetectorRef.markForCheck();
    }


    onAddress() {
        const addressFormGroup = this._formBuilder.group({
            country_id: [''],
            city_id: [''],
            district_id: [''],
            contact_value: [''],
            contact_description: [''],
            contact_type: ['Address'],
            is_default: true
        });

        (this.customerForm.get('address') as FormArray).push(addressFormGroup);

        this._changeDetectorRef.markForCheck();
    }

    addEmailField(): void {
        const emailFormGroup = this._formBuilder.group({
            email: [''],
            label: ['']
        });

        (this.customerForm.get('emails') as FormArray).push(emailFormGroup);

        this._changeDetectorRef.markForCheck();
    }

    removeEmailField(index: number): void {
        const emailsFormArray = this.customerForm.get('emails') as FormArray;

        emailsFormArray.removeAt(index);

        this._changeDetectorRef.markForCheck();
    }

    cancel() {
        this.store.dispatch(new Navigate(['customer/list']))
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
