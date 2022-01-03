import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Select, Store} from "@ngxs/store";
import {Observable} from "rxjs";
import {UserStateModel, UserUpdateStateModel} from "../../../shared/state/models/user";
import {UserState} from "../../../shared/state/user.state";
import {ActivatedRoute} from "@angular/router";
import {CreateUser, GetUsers, UserUpdate} from "../../../shared/state/actions/user.action";
import {map, skip, startWith} from "rxjs/operators";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {CommonState} from "../../../shared/state/common.state";
import {CityStateModel, CountryStateModel, DistrictStateModel} from "../../../shared/state/models/common";
import {RoleStateModel} from "../../../shared/state/models/role";
import {GetCities, GetCountries, GetDistricts, GetRoles} from "../../../shared/state/actions/common.action";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {COMMA, ENTER} from "@angular/cdk/keycodes";

@Component({
    selector: 'app-user-detail',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

    @Select(UserState.updateUser)
    user: Observable<UserUpdateStateModel>;

    @Select(UserState.getUserList)
    userDetail$: Observable<UserStateModel>;

    @Select(CommonState.getCountryList)
    countries$: Observable<CountryStateModel>;

    @Select(CommonState.getCityList)
    cities$: Observable<CityStateModel>;

    @Select(CommonState.getDistrictList)
    districts$: Observable<DistrictStateModel>;

    @Select(CommonState.getRoleList)
    roles$: Observable<RoleStateModel>;

    userID: number;

    userForm: FormGroup;

    removable = true;
    roles: string[] = ['Standart', 'Admin'];
    roleCtrl = new FormControl();
    filteredRoles: Observable<string[]>;
    allRoles= [];
    roleId = [];
    separatorKeysCodes: number[] = [ENTER, COMMA];
    @ViewChild('roleInput') roleInput: ElementRef<HTMLInputElement>;

    constructor(public route: ActivatedRoute,
                public store: Store,
                public _formBuilder: FormBuilder,
                public toastr: ToastrService) {
    }

    ngOnInit(): void {
        this.userForm = this._formBuilder.group({
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            email: ['', Validators.required],
            phone_number: ['', Validators.required],
            title: ['', Validators.required],
            address: ['', Validators.required],
            country_id: ['', Validators.required],
            city_id: ['', Validators.required],
            district_id: ['', Validators.required],
            role_id_list:  new FormArray([])
        })

        this.userID = +this.route.snapshot.paramMap.get('id');
        this.store.dispatch([new GetUsers({
            pageNumber: 0,
            pageSize: 5
        })])

        this.userDetail$.subscribe((user) => {
            if (user.Users) {
                user.Users.forEach(user => {
                    if (this.userID == user.user_id) {
                        this.userForm.patchValue(user)
                        this.store.dispatch(new GetCountries())
                        this.store.dispatch(new GetCities(1))
                        this.store.dispatch(new GetDistricts(user.city_id))
                        this.store.dispatch(new GetRoles({page:0,size:10, search:""}))
                    }
                })
            }
        });

        this.filteredRoles = this.roleCtrl.valueChanges.pipe(
            startWith(null),
            map((role: string | null) => role ? this._filter(role) : this.allRoles.slice()));
        this.roles$.subscribe(data => {
            this.allRoles =[];
            if(data.Roles)
                data.Roles.forEach(role => {
                    this.allRoles.push(role)
                })
        })
    }

    selectChangedCountry(event) {
        this.store.dispatch(new GetCities(event.value))
    }

    selectChangedCity(event) {
        this.store.dispatch(new GetDistricts(event.value))
    }

    remove(role: string): void {
        const index = this.roles.indexOf(role);

        if (index >= 0) {
            this.roles.splice(index, 1);
        }
    }

    add(event): void {
        const value = (event.value || '').trim();

        if (value) {
            this.roles.push(value);
        }

        this.roleCtrl.setValue(null);
    }

    selected(event): void {
        this.roles.push(event.option.viewValue);
        this.roleInput.nativeElement.value = '';
        this.roleCtrl.setValue(null);

        this.roleId.push(event.option.value);
    }

     _filter(value: string): string[] {
         return this.allRoles.filter(o =>
             Object.keys(o).some(k => o[k].toString().toLowerCase().includes(value.toLowerCase())));
    }


    updateUser() {
    let form = this.userForm.value;
        this.store.dispatch([new UserUpdate(form, this.userID)]).subscribe({
            next: () => {
                this.toastr.success('Kullanıcı güncellendi');
            },
            error: (error) => {
                this.toastr.error('Kullanıcı güncellenemedi', 'Hata', {
                    timeOut: 3000,
                });
            }
        });
    }

}
