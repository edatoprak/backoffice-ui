import { Injectable } from '@angular/core';
import {
    Resolve
} from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import {GetCustomers} from '../state/actions/customer.action';
import { mapTo } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class CustomerResolver implements Resolve<any> {
    constructor(private store: Store) {}

    resolve(): Observable<null> {
        return this.store
            .dispatch([
                new GetCustomers({
                    page: 0,
                    order: 'asc',
                    size: 5,
                    searchKey: '',
                    sort: 'customer_id',
                }),
            ])
            .pipe(mapTo(null));
    }
}
