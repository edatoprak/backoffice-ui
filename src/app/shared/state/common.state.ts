import {Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {CommonService} from "../services/common.service";
import {Cities, CityStateModel, CountryStateModel, Districts, DistrictStateModel} from "./models/common";
import {GetCities, GetCountries, GetDistricts, GetRoles, GetTest} from "./actions/common.action";
import {tap} from "rxjs/operators";
import {AddProduct, GetProducts} from "./actions/product.action";
import {ProductStateModel} from "./models/product";
import {RoleStateModel} from "./models/role";


@State<CountryStateModel>({
    name: 'Countries',
    defaults: {
        Countries: []
    }
})
@State<any>({
    name: 'Test',
    defaults: {
        Tests: [{
            form_control_id: 1,
            control_type: "",
            control_name: "",
            control_values: "",
            control_validators: "",
            place_holder: "",
            hint: "",
            label: "",
            width: "",
            form_class: "",
            form_name: ""
        }]
    }
})

@State<CityStateModel>({
    name: 'Cities',
    defaults: {
        Cities: []
    }
})

@State<DistrictStateModel>({
    name: 'Districts',
    defaults: {
        Districts: []
    }
})

@State<RoleStateModel>({
    name: 'Roles',
    defaults: {
        Roles: []
    }
})

@Injectable()
export class CommonState {
    constructor(private commonService: CommonService) {
    }

    @Selector()
    static getTestList(Test) {
        return Test.Tests;
    }

    @Selector()
    static getCountryList(CountryList: CountryStateModel) {
        return CountryList;
    }

    @Selector()
    static getCityList(CityList: CityStateModel) {
        return CityList;
    }

    @Selector()
    static getDistrictList(DistrictList: DistrictStateModel) {
        return DistrictList;
    }

    @Selector()
    static getRoleList(RoleList: RoleStateModel) {
        return RoleList;
    }

    @Action(GetTest)
    getTest({patchState}: StateContext<any>) {
        return this.commonService.getTests().pipe(tap((response: any) => {
            patchState(({Tests: response.data}))
        }))
    }

    @Action(GetCountries)
    getCountries({patchState}: StateContext<CountryStateModel>) {
        return this.commonService.getCountries().pipe(tap((response: any) => {
            patchState(({Countries: response.data}))
        }))
    }

    @Action(GetCities)
    getCities({patchState}: StateContext<CityStateModel>, payload) {
        return this.commonService.getCities(payload.payload).pipe(
            tap(
                (response: any) => {
                    patchState({Cities: response.data});
                }
            )
        );
    }

    @Action(GetDistricts)
    getDistricts({patchState}: StateContext<DistrictStateModel>, payload) {
        return this.commonService.getDistricts(payload.payload).pipe(
            tap(
                (response: any) => {
                    patchState({Districts: response.data});
                }
            )
        );
    }

    @Action(GetRoles)
    getRoles({patchState}: StateContext<any>, payload) {
        return this.commonService.getAllRoles(payload.payload).pipe(tap((response: any) => {
            patchState({Roles: response.data.content})
        }));
    }


}
