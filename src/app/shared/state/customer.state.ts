import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {tap} from 'rxjs/operators';
import {CustomerService} from '../services/customer.service';
import {
    AemCustomer,
    CreateCustomer,
    GetCustomerDetail,
    GetCustomers,
    SearchCustomer,
    UpdateCustomerDetail
} from './actions/customer.action';
import {
    CustomerDetailStateModel,
    Customers,
    CustomerSearchStateModel,
    CustomerStateModel,
    Pagination, UpdateCustomerStateModel
} from './models/customer';
import {UpdateProduct} from "./actions/product.action";

@State<CustomerSearchStateModel>({
    name: 'SearchCustomers',
    defaults: {
        CustomersSearch: []
    },
})
@State<CustomerStateModel>({
    name: 'Customers',
    defaults: {
        Customers: [],
        Pagination: null,
    },
})

@State<CustomerDetailStateModel>({
    name: 'CustomerDetail',
    defaults: {
        CustomerDetail: {
            customer_contact_dto_list: [],
            customer_id: 0,
            first_name: '',
            last_name: '',
            nation_number: '',
            is_active: true
        }
    },
})

@State<UpdateCustomerStateModel>({
    name: 'UpdateCustomer',
    defaults: {
        UpdateCustomer: {
            customer_contact_update_dto_list: [],
        }
    },
})

@Injectable()
export class CustomerState {
    constructor(private customerService: CustomerService) {
    }

    @Selector()
    static getCustomerList(CustomerList: CustomerStateModel) {
        return CustomerList;
    }

    @Selector()
    static getSearchCustomer(CustomerList: CustomerSearchStateModel) {
        return CustomerList;
    }

    @Selector()
    static getCustomerDetailList(CustomerDetailList: CustomerDetailStateModel) {
        return CustomerDetailList;
    }

    @Selector()
    static updateCustomerDetailList(UpdateCustomerDetailList: UpdateCustomerStateModel) {
        return UpdateCustomerDetailList;
    }

    @Action(SearchCustomer)
    searchCustomer({patchState}: StateContext<CustomerSearchStateModel>, payload) {
        return this.customerService.getSearchCustomers(payload.params).pipe(
            tap(
                (response: any) => {
                    patchState({CustomersSearch: response.data.content});
                }
            )
        );
    }

    @Action(GetCustomers)
    getCustomers({patchState}: StateContext<CustomerStateModel>, payload) {
        return this.customerService.getAllCustomers(payload.params).pipe(tap((response: any) => {
            patchState({Customers: response.data, Pagination: response.data});
        }));
    }

    @Action(CreateCustomer)
    addCustomer({getState, patchState}: StateContext<CustomerStateModel>, payload) {
        return this.customerService.addCustomer(payload.payload).pipe(tap((response: any) => {
            const state = getState();
            patchState({
                Customers: [...state.Customers, response]
            })
        }));
    }

    @Action(GetCustomerDetail)
    getCustomerDetail({patchState}: StateContext<CustomerDetailStateModel>, payload) {
        return this.customerService.getCustomerDetail(payload.payload).pipe(tap((response: any) => {
            patchState({CustomerDetail: response.data});
        }));
    }

    @Action(UpdateCustomerDetail)
    updateCustomerDetail({patchState}: StateContext<UpdateCustomerStateModel>, payload) {
        return this.customerService.updateCustomerContacts(payload.payload).pipe(tap((response: any) => {
            patchState({
                UpdateCustomer: response
            })
        }));
    }
}
