import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UserDetailComponent} from './user-detail.component';
import {RouterTestingModule} from "@angular/router/testing";
import {NgxsModule, Store} from "@ngxs/store";
import {UserState} from "../../../shared/state/user.state";
import {UserService} from "../../../shared/services/user.service";
import {HttpClient, HttpClientModule, HttpHandler} from "@angular/common/http";
import {FormBuilder, FormsModule, NgForm, ReactiveFormsModule, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatSelectModule} from "@angular/material/select";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatChipsModule} from "@angular/material/chips";
import {of} from "rxjs";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MatIconModule} from "@angular/material/icon";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {CommonState} from "../../../shared/state/common.state";
import {CommonService} from "../../../shared/services/common.service";
import {GetDistricts} from "../../../shared/state/actions/common.action";
import {CreateUser, UserUpdate} from "../../../shared/state/actions/user.action";

describe('UserDetailComponent', () => {
    let component: UserDetailComponent;
    let fixture: ComponentFixture<UserDetailComponent>;
    let store: Store;
    let userService: UserService;
    let formBuilder: FormBuilder;
    let commonService: CommonService;

    beforeEach(async () => {
        const toastrServiceStub = () => ({
            success: string => ({}),
            error: (string, string1, object) => ({})
        });
        await TestBed.configureTestingModule({
            declarations: [UserDetailComponent],
            imports: [NgxsModule.forRoot([UserState, CommonState]), RouterTestingModule, HttpClientModule, FormsModule, ReactiveFormsModule, MatFormFieldModule,
                MatInputModule, MatAutocompleteModule, MatSelectModule, BrowserAnimationsModule, MatChipsModule, HttpClientTestingModule],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [UserService, CommonService, HttpClient, FormBuilder,
                NgForm,
                {provide: ToastrService, useFactory: toastrServiceStub},]
        })
        fixture = TestBed.createComponent(UserDetailComponent);
        component = fixture.componentInstance;
        userService = TestBed.inject(UserService);
        commonService = TestBed.inject(CommonService);
        store = TestBed.inject(Store);
        formBuilder = TestBed.inject(FormBuilder);

        Object.defineProperty(component, 'user', {writable: true});
        Object.defineProperty(component, 'userDetail$', {writable: true});
        Object.defineProperty(component, 'countries$', {writable: true});
        Object.defineProperty(component, 'cities$', {writable: true});
        Object.defineProperty(component, 'districts$', {writable: true});
        Object.defineProperty(component, 'roles$', {writable: true});

        component.user = of()
        component.userDetail$ = of({
            Users:
                [
                    {
                        "user_id": 44,
                        "first_name": "XXXX",
                        "last_name": "xxxxxx",
                        "title": "Developer",
                        "email": "dene@gmail.com",
                        "phone_number": "05555555555",
                        "address": "Etiya",
                        "country_id": 1,
                        "city_id": 1,
                        "district_id": 1,
                        "roles": []
                    },
                    {
                        "user_id": 0,
                        "first_name": "Test",
                        "last_name": "XXXX",
                        "title": "Engineer",
                        "email": "xxx@gmail.com",
                        "phone_number": "05556566555",
                        "address": "Etiya",
                        "country_id": 1,
                        "city_id": 2,
                        "district_id": 17,
                        "roles": []
                    },
                    {
                        "user_id": 34,
                        "first_name": "Test5",
                        "last_name": "XXXXX",
                        "title": "Engineer",
                        "email": "test@gmail.com",
                        "phone_number": "05553666666",
                        "address": "Etiya",
                        "country_id": 1,
                        "city_id": 1,
                        "district_id": 2,
                        "roles": []
                    }
                ],
            Pagination: [
            ]
        })
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
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            email: ['', Validators.required],
            phone_number: ['', Validators.required],
            title: ['', Validators.required],
            address: ['', Validators.required],
            country_id: ['', Validators.required],
            city_id: ['', Validators.required],
            district_id: ['', Validators.required],
            role_id_list: ['', Validators.required]
        })
        fixture.detectChanges();
    });


    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(`removable has default value`, () => {
        expect(component.removable).toEqual(true);
    });

    it(`roles has default value`, () => {
        expect(component.roles).toEqual([`Standart`, `Admin`]);
    });

    it(`allRoles has default value`, () => {
        expect(component.allRoles.length).toEqual(2);
    });

    it(`roleId has default value`, () => {
        expect(component.roleId).toEqual([]);
    });

    it(`separatorKeysCodes has default value`, () => {
        expect(component.separatorKeysCodes).toEqual([ENTER, COMMA]);
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
        expect(component.roles.length).toEqual(3)

    });

    it('should remove', () => {
        component.add({value: 'Seller'})
        component.remove('Seller');
        expect(component.roles.length).toEqual(2)
    });

    it('should selected value', () => {
        component.add({value: 'Seller'})
        component.selected({option: {viewValue: 'Seller', value: 'Seller'}})
        expect(component.roles.length).toEqual(4)
        expect(component.roleId.length).toEqual(1)
    });

    describe('selectChangedCountry', () => {
        it('makes expected calls', () => {
            spyOn(commonService, 'getCities').and.callFake(function (value) {
                return of({
                    "data": [{"city_id": 6, "city_name": "ANKARA"}],
                    "id": 0,
                    "message": "string",
                    "success": true
                });
            })
            component.selectChangedCountry({value: 6})
            const cityList = store.selectSnapshot(CommonState.getCityList);
            expect(cityList.Cities.length).toEqual(1);
        });
    })
    describe('selectChangedCity', () => {
        it('makes expected calls', () => {
            spyOn(commonService, 'getDistricts').and.callFake(function (value) {
                return of({
                    "data": [{"district_id": 419, "district_name": "Avcılar"}],
                    "id": 0,
                    "message": "string",
                    "success": true
                });
            })
            component.selectChangedCity({value: 34})
            const districtList = store.selectSnapshot(CommonState.getDistrictList);
            expect(districtList.Districts.length).toEqual(1);
        });
    });

    describe('updateUser', () => {
        it('makes expected calls', () => {
            spyOn(userService, 'getUserByID').and.callFake(function (value) {
                return of({
                    data: {
                        "deneme": 1
                    },
                    "success": true,
                    "id": 40,
                    "message": "Kullanıcı başarıyla güncellendi."
                });
            });

            component.updateUser();
            expect(component.store.selectSnapshot(UserState.updateUser)).toBeTruthy();

        })
    })

    describe('ngOnInit', () => {
        it('makes expected calls', () => {
            component.ngOnInit();
            expect(component.userID).toEqual(0);

        })
    })
});
