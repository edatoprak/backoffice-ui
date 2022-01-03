import {ComponentFixture, TestBed, tick} from '@angular/core/testing';

import {UserAddComponent} from './user-add.component';
import {NgxsModule, Store} from "@ngxs/store";
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormsModule,
    NgForm,
    ReactiveFormsModule
} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {RouterTestingModule} from "@angular/router/testing";
import {UserState} from "../../../shared/state/user.state";
import {DebugElement, forwardRef, NO_ERRORS_SCHEMA} from "@angular/core";
import {ToastrService} from "ngx-toastr";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {Observable, of, throwError} from "rxjs";
import {MatSelectModule} from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatChipsModule} from "@angular/material/chips";
import {UserService} from "../../../shared/services/user.service";
import {GetCities, GetCountries, GetRoles} from "../../../shared/state/actions/common.action";
import {CommonState} from "../../../shared/state/common.state";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {CommonService} from 'app/shared/services/common.service';
import {CreateUser} from "../../../shared/state/actions/user.action";


describe('UserAddComponent', () => {
    let component: UserAddComponent;
    let fixture: ComponentFixture<UserAddComponent>;
    let store: Store;
    let formBuilder: FormBuilder;
    let service: UserService;
    let debugElement: DebugElement;
    let commonService: CommonService;

    beforeEach(async () => {
        const toastrServiceStub = () => ({
            success: string => ({}),
            error: (string, string1, object) => ({})
        });
        await TestBed.configureTestingModule({
            declarations: [UserAddComponent],
            imports: [HttpClientModule, FormsModule, ReactiveFormsModule, RouterTestingModule, MatAutocompleteModule, MatSelectModule, MatFormFieldModule, MatInputModule,
                BrowserAnimationsModule, MatChipsModule, MatInputModule,
                NgxsModule.forRoot([UserState, CommonState])],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                FormBuilder,
                NgForm,
                {provide: ToastrService, useFactory: toastrServiceStub},
                UserService,
                CommonService
            ]
        })
            .compileComponents();
        fixture = TestBed.createComponent(UserAddComponent);
        component = fixture.componentInstance;
        formBuilder = TestBed.inject(FormBuilder);
        service = TestBed.inject(UserService);
        commonService = TestBed.inject(CommonService);
        store = TestBed.inject(Store);
        debugElement = fixture.debugElement;

        Object.defineProperty(component, 'countries$', {writable: true});
        Object.defineProperty(component, 'cities$', {writable: true});
        Object.defineProperty(component, 'districts$', {writable: true});
        Object.defineProperty(component, 'roles$', {writable: true});
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
        component.roles$ = of({
            Roles: [
                {
                    role_id: 1,
                    role_name: "Admin"
                },
                {
                    role_id: 2,
                    role_name: "Standart"
                }
            ]
        });

        component.userForm = formBuilder.group({
            first_name: new FormControl(''),
            last_name: new FormControl(''),
            email: new FormControl(''),
            password: new FormControl(''),
            confirm_password: new FormControl(''),
            phone_number: new FormControl(''),
            address: new FormControl(''),
            city_id: new FormControl(''),
            country_id: new FormControl(''),
            district_id: new FormControl(''),
            title: new FormControl(''),
        })

        fixture.detectChanges();
    });


    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it(`selectable has default value`, () => {
        expect(component.selectable).toEqual(true);
    });

    it(`removable has default value`, () => {
        expect(component.removable).toEqual(true);
    });

    it(`separatorKeysCodes has default value`, () => {
        expect(component.separatorKeysCodes).toEqual([ENTER, COMMA]);
    });

    it(`roles has default value`, () => {
        expect(component.roles).toEqual([]);
    });

    it(`allRoles has default value`, () => {
        expect(component.allRoles.length).toEqual(2);
    });

    it(`roleId has default value`, () => {
        expect(component.roleId).toEqual([]);
    });

    describe('ngOnInit', () => {
        it('makes expected calls', async () => {
            store.dispatch(new GetCountries()).subscribe(data => console.log(data));

            const countryList = store.selectSnapshot(CommonState.getCountryList);
            console.log(countryList);
            expect(countryList).toEqual({Countries: []});

        });
    });

    describe('clearForm', () => {
        it('should reset form', () => {
            const debugElement = fixture.debugElement;
            const form: NgForm = debugElement.children[0].injector.get(NgForm);
            const spy = spyOn(form, 'resetForm');
            component.clearForm(form);
            expect(spy).toHaveBeenCalled();

            const roleId = component.roleId;
            expect(roleId).toEqual([]);
        });
    });
    describe('_filter', () => {
        const mockRoleArray = [
            {
                role_id: 1,
                role_name: 'Admin'
            },
            {
                role_id: 2,
                role_name: 'Standart'
            }
        ]
        it("allRoles should trigger and filter", () => {
            component.allRoles = mockRoleArray;

            const expected = [
                {
                    role_id: 2,
                    role_name: 'Standart'
                }
            ];

            expect(component._filter('Sta').length).toEqual(1);

        });
    });

    it('should add item', () => {
        component.add({value: 'Seller'})
        expect(component.roles.length).toEqual(1)

    });

    it('should remove item', () => {
        component.add({value: 'Seller'})
        component.remove('Seller');
        expect(component.roles.length).toEqual(0)
    });

    it('should selected value', () => {
        component.add({value: 'Seller'})
        component.selected({option: {viewValue: 'Seller', value: 'Seller'}})
        expect(component.roles.length).toEqual(2)
        expect(component.roleId.length).toEqual(1)
    });


    it('makes expected calls for cities', () => {
        spyOn(commonService, 'getCities').and.callFake(function (value) {
            return of({"data": [{"city_id": 1, "city_name": "Adana"}], "id": 0, "message": "string", "success": true});
        })
        component.selectChangedCountry({value: 1})
        const cityList = store.selectSnapshot(CommonState.getCityList);
        expect(cityList.Cities.length).toEqual(1);
    });

    it('makes expected calls for districts', () => {
        spyOn(commonService, 'getDistricts').and.callFake(function (value) {
            return of({"data": [{"district_id": 416, "district_name": "Adalar"}], "id": 0, "message": "string", "success": true});
        })
        component.selectChangedCity({value: 34})
        const districtList = store.selectSnapshot(CommonState.getDistrictList);
        expect(districtList.Districts.length).toEqual(1);
    });

    it('submit', () => {

        spyOn(service, 'addUser').and.callFake(function (value) {
            return of({
                "success": true,
                "id": 40,
                "message": "Kullanıcı başarıyla eklendi."
            });
        })
        component.store.dispatch(new CreateUser({
            first_name: 'Etiya',
            last_name: 'Test',
            email: 'etiya@gmail.com',
            password: '12345',
            phone_number: '05555555555',
            address: 'İstanbul',
            city_id: 34,
            country_id: 1,
            district_id: 416,
            title: 'Engineer',
            role_id_list: [0,1]
        }));
        component.saveUser();
        expect(component.store.selectSnapshot(UserState.getUserList)).toBeTruthy();
    });


});
