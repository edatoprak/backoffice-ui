import {Injectable} from '@angular/core';
import {cloneDeep} from 'lodash-es';
import {FuseMockApiService} from '@fuse/lib/mock-api/mock-api.service';
import { customers } from './data';

@Injectable({
    providedIn: 'root'
})
export class CustomerMockApi {
    private _customers: any[] = customers;

    constructor(private _fuseMockApiService: FuseMockApiService) {
        this.registerHandlers();
    }

    registerHandlers(): void {

        this._fuseMockApiService
            .onGet('/api/v1/customers/search')
            .reply(({request}) => {
                const search = request.params.get('search');
                let customers = cloneDeep(this._customers);
                if (search&&search!=''&&search['search'] &&search['search'].toString()!='') {
                    customers = customers.filter(dd => dd.first_name && dd.first_name.toLowerCase().includes(search.toLowerCase()));
                }
                return [
                    200,
                    {
                        Customers: customers
                    }
                ];
            });

        this._fuseMockApiService
            .onGet('api/v1/customers/getall', 300)
            .reply(({request}) => {
                const search = request.params.get('search');
                const sort = request.params.get('sort') || 'first_name';
                const order = request.params.get('order') || 'asc';
                const page = parseInt(request.params.get('page') ?? '0', 10);
                const size = parseInt(request.params.get('size') ?? '20', 10);
                let customers: any[] | null = cloneDeep(this._customers);
                if (sort === 'first_name') {
                    customers.sort((a, b) => {
                        const fieldA = a[sort].toString().toUpperCase();
                        const fieldB = b[sort].toString().toUpperCase();
                        return order === 'asc' ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
                    });
                } else {
                    customers.sort((a, b) => order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]);
                }

                if (search&&search!=''&&search['search'] &&search['search'].toString()!='') {
                    customers = customers.filter(dd => dd.first_name && dd.first_name.toLowerCase().includes(search['search'].toString().toLowerCase()));
                }

                if (search&&search!=''&&search['first_name'] &&search['first_name'].toString()!='') {
                    customers = customers.filter(dd => dd.first_name && dd.first_name==search['first_name']);
                }
                const customersLength = customers.length;
                const begin = page * size;
                const end = Math.min((size * (page + 1)), customersLength);
                const lastPage = Math.max(Math.ceil(customersLength / size), 1);
                let pagination = {};
                if (page > lastPage) {
                    customers = null;
                    pagination = {
                        lastPage
                    };
                } else {
                    customers = customers.slice(begin, end);
                    pagination = {
                        length: customersLength,
                        size: size,
                        page: page,
                        lastPage: lastPage,
                        startIndex: begin,
                        endIndex: end - 1
                    };
                }
                console.log('tekrar');
                return [
                    200,
                    {
                        Customers: customers,
                        Pagination: pagination
                    }
                ];
            });

    }
}
