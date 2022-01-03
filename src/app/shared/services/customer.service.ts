import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AddCustomer, ListParams} from '../../shared/state/models/customer';

@Injectable({
    providedIn: 'root',
})
export class CustomerService {
    constructor(private _httpClient: HttpClient) {
    }

    getAllCustomers(listparams: ListParams) {
        return this._httpClient.get('http://159.69.28.194:8080/api/v1/customers/getall', {
            params: {...listparams},
        });
    }

    getSearchCustomers(listparams: ListParams) {
        return this._httpClient.get('http://159.69.28.194:8080/api/v1/customers/getall', {
            params: {...listparams},
        });
    }

    addCustomer(createCustomer: AddCustomer) {
        return this._httpClient.post('http://159.69.28.194:8080/api/v1/customers/add', createCustomer)
    }

    getCustomerDetail(customerId) {
        return this._httpClient.get('http://159.69.28.194:8080/api/v1/customers/getbyid/' + customerId)
    }

    updateCustomerContacts(customerDetail) {
        return this._httpClient.post('http://159.69.28.194:8080/api/v1/customers/updatecontacts', customerDetail)
    }

}
