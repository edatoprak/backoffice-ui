import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators, NgForm, FormArray} from "@angular/forms";
import {Select, Store} from "@ngxs/store";
import {CommonState} from "../../../shared/state/common.state";
import {Observable} from "rxjs";
import {CityStateModel, CountryStateModel, DistrictStateModel} from "../../../shared/state/models/common";
import {GetCities, GetCountries, GetDistricts, GetRoles} from "../../../shared/state/actions/common.action";
import {CreateUser} from "../../../shared/state/actions/user.action";
import {map, startWith} from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {RoleStateModel} from 'app/shared/state/models/role';
import {ToastrService} from "ngx-toastr";
import {ConfirmPasswordValidator} from '../confirm-password.validator';
import {Router} from "@angular/router";

@Component({
    selector: 'app-user-add',
    templateUrl: './user-add.component.html',
    styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {

    @ViewChild('supportNgForm') supportNgForm: NgForm;

    @Select(CommonState.getCountryList)
    countries$: Observable<CountryStateModel>;

    @Select(CommonState.getCityList)
    cities$: Observable<CityStateModel>;

    @Select(CommonState.getDistrictList)
    districts$: Observable<DistrictStateModel>;

    @Select(CommonState.getRoleList)
    roles$: Observable<RoleStateModel>;

    userForm: FormGroup;

    selectable = true;
    removable = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    roleCtrl = new FormControl();
    filteredRoles: Observable<string[]>;
    roles: string[] = [];
    allRoles = [];
    roleId = [];

    @ViewChild('roleInput') roleInput: ElementRef<HTMLInputElement>;

    constructor(public _formBuilder: FormBuilder,
                public store: Store,
                public toastr: ToastrService,
                private router: Router) {

    }

    ngOnInit(): void {
        this.userForm = this._formBuilder.group({
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.required],
            confirm_password: ['', Validators.required],
            phone_number: ['', Validators.required],
            address: ['', Validators.required],
            city_id: ['', Validators.required],
            country_id: ['', Validators.required],
            district_id: ['', Validators.required],
            title: ['', Validators.required],
            role_id_list: new FormArray([])
        }, {validator: ConfirmPasswordValidator("password", "confirm_password")})


        this.filteredRoles = this.roleCtrl.valueChanges.pipe(
            startWith(null),
            map((role: string | null) => role ? this._filter(role) : this.allRoles.slice()));
        this.roles$.subscribe(data => {
            this.allRoles = [];
            if (data.Roles)
                data.Roles.forEach(role => {
                    this.allRoles.push(role)
                })
        })

        this.store.dispatch(new GetCountries())
        this.store.dispatch(new GetCities(1))
        this.store.dispatch(new GetRoles({page: 0, size: 10, search: ""}))

    }

    selectChangedCountry(event) {
        this.store.dispatch(new GetCities(event.value));
    }


    selectChangedCity(event) {
        this.store.dispatch(new GetDistricts(event.value))
    }

    saveUser() {
        let form = this.userForm.value;
        this.store.dispatch([new CreateUser({
            first_name: form.first_name,
            last_name: form.last_name,
            email: form.email,
            password: form.password,
            phone_number: form.phone_number,
            address: form.address,
            city_id: form.city_id,
            country_id: form.country_id,
            district_id: form.district_id,
            title: form.title,
            role_id_list: this.roleId
        })]).subscribe({
            next: () => {
                this.toastr.success('Kullanıcı eklendi');
                this.router.navigate(['user/list'])
            },
            error: (error) => {
                this.toastr.error('Kullanıcı eklenemedi', 'Hata', {
                    timeOut: 3000,
                });
            }
        })
    }

    add(event): void {
        const value = (event.value || '').trim();

        if (value) {
            this.roles.push(value);
        }
        if (event.chipInput)
            event.chipInput.clear();

        this.roleCtrl.setValue(null);
    }

    remove(role: string): void {
        const index = this.roles.indexOf(role);

        if (index >= 0) {
            this.roles.splice(index, 1);
        }
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

    clearForm(e): void {
        this.roleId = [];
        e.resetForm();
    }

}
