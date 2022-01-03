import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCustomerComponent } from './create-customer.component';
import {FormArray, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgxsModule, Store} from "@ngxs/store";
import {CustomerState} from "../../../shared/state/customer.state";
import {CustomerService} from "../../../shared/services/customer.service";
import {HttpClient, HttpClientModule, HttpHandler} from "@angular/common/http";
import {ChangeDetectorRef, NO_ERRORS_SCHEMA} from "@angular/core";
import {RouterTestingModule} from "@angular/router/testing";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatSelectModule} from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatChipsModule} from "@angular/material/chips";
import {UserAddComponent} from "../../user/user-add/user-add.component";
import {UserService} from "../../../shared/services/user.service";
import {CommonService} from "../../../shared/services/common.service";
import {CommonState} from "../../../shared/state/common.state";
import {of} from "rxjs";
import {CreateUser} from "../../../shared/state/actions/user.action";
import {UserState} from "../../../shared/state/user.state";
import {CreateCustomer} from "../../../shared/state/actions/customer.action";

describe('CreateCustomerComponent', () => {
  let component: CreateCustomerComponent;
  let fixture: ComponentFixture<CreateCustomerComponent>;
  let store: Store;
  let customerService: CustomerService;
  let formBuilder: FormBuilder;
  let commonService: CommonService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCustomerComponent ],
        imports: [HttpClientModule, FormsModule, ReactiveFormsModule, RouterTestingModule, MatAutocompleteModule, MatSelectModule, MatFormFieldModule, MatInputModule,
            BrowserAnimationsModule, MatChipsModule, MatInputModule,
            NgxsModule.forRoot([CustomerState, CommonState])],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [CustomerService, CommonService, HttpClient, HttpHandler]
    })
      fixture = TestBed.createComponent(CreateCustomerComponent);
      component = fixture.componentInstance;
      formBuilder = TestBed.inject(FormBuilder);
      customerService = TestBed.inject(CustomerService);
      commonService = TestBed.inject(CommonService);
      store = TestBed.inject(Store);

      Object.defineProperty(component, 'countries$', {writable: true});
      Object.defineProperty(component, 'cities$', {writable: true});
      Object.defineProperty(component, 'districts$', {writable: true});

      component.countries$ = of({
          Countries: [
              {
                  country_id: 1,
                  country_name: 'Türkiye',
                  nation_code: 'TR'
              }
          ]
      });
      component.cities$ = of({
          Cities: [
              {
                  city_id: 1,
                  city_name: 'Adana'
              }
          ]
      });
      component.districts$ = of({Districts: []});

      component.customerForm = formBuilder.group({
          id: new FormControl(''),
          firstName: new FormControl(''),
          lastName: new FormControl(''),
          natId: new FormControl(''),
          birthday: new FormControl(''),
          phoneNumbers: new FormArray([]),
          emails: new FormArray([]),
          address: new FormArray([]),
      })

      fixture.detectChanges();
  });

    it('can load instance', () => {
        expect(component).toBeTruthy();
    });

    it(`selected has default value`, () => {
        expect(component.selected).toEqual(1);
    });

    describe('ngOnInit', () => {
        it('makes expected calls', () => {
            const formBuilderStub: FormBuilder = fixture.debugElement.injector.get(
                FormBuilder
            );
            const storeStub: Store = fixture.debugElement.injector.get(Store);
            spyOn(component, 'onAddress').and.callThrough();
            spyOn(component, 'onPhoneNumber').and.callThrough();
            spyOn(component, 'addEmailField').and.callThrough();
            spyOn(formBuilderStub, 'group').and.callThrough();
            spyOn(formBuilderStub, 'array').and.callThrough();
            spyOn(storeStub, 'dispatch').and.callThrough();
            component.ngOnInit();
            expect(component.onAddress).toHaveBeenCalled();
            expect(component.onPhoneNumber).toHaveBeenCalled();
            expect(component.addEmailField).toHaveBeenCalled();
            expect(formBuilderStub.group).toHaveBeenCalled();
            expect(formBuilderStub.array).toHaveBeenCalled();
            expect(storeStub.dispatch).toHaveBeenCalled();
        });
    });

    it('makes expected calls for cities', () => {
        spyOn(commonService, 'getCities').and.callFake(function (value) {
            return of({"data": [{"city_id": 1, "city_name": "Adana"}], "id": 0, "message": "string", "success": true});
        })
        component.selectChangedCountry({value: 1})
        const cityList = store.selectSnapshot(CommonState.getCityList);
        console.log("city", cityList);
        expect(cityList.Cities.length).toEqual(1);
    });

    it('makes expected calls for districts', () => {
        spyOn(commonService, 'getDistricts').and.callFake(function (value) {
            return of({"data": [{"district_id": 416, "district_name": "Adalar"}], "id": 0, "message": "string", "success": true});
        })
        component.selectChangedCity({value: 34})
        const districtList = store.selectSnapshot(CommonState.getDistrictList);
        console.log("district", districtList);
        expect(districtList.Districts.length).toEqual(1);
    });

    describe('trackByFn', () => {
        it('makes expected calls', () => {
            expect(component.trackByFn(1, {id: 1})).toEqual(1);
        });
    });

    describe('onSubmit', () => {
        it('makes expected calls', () => {
            spyOn(customerService, 'addCustomer').and.callFake(function (value) {
                return of({
                    "success": true,
                    "id": null,
                    "message": "Müşteri eklendi."
                });
            })
            component.store.dispatch(new CreateCustomer({
                "customer_contact_list": [
                    {
                        "city_id": 34,
                        "contact_description": "İş",
                        "contact_type": "Address",
                        "contact_value": "İstanbul",
                        "country_id": 1,
                        "district_id": 416,
                        "is_default": true
                    }
                ],
                "first_name": "Denemexx",
                "last_name": "Etiya",
                "nation_number": "22331166554"
            }));
            component.onSubmit();
            expect(component.store.selectSnapshot(CustomerState.getCustomerList)).toBeTruthy();
        });
    });

    describe('cancel', () => {
        it('makes expected calls', () => {
            const storeStub: Store = fixture.debugElement.injector.get(Store);
            spyOn(storeStub, 'dispatch').and.callThrough();
            component.cancel();
            expect(storeStub.dispatch).toHaveBeenCalled();
        });
    });

    it('Should remove', () => {
        const fb = new FormBuilder();
        const myObject = fb.group([{
            country_id: [''],
            city_id: [''],
            district_id: [''],
            contact_value: [''],
            contact_description: [''],
            contact_type: ['Address'],
            is_default: true
        }]);

        component.removeEmailField(myObject[0]);

        const packagesLength = component.customerForm.get('emails')['controls'];

        expect(packagesLength.length).toEqual(0);
    });

});
