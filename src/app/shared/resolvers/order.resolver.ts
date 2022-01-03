import { Injectable } from '@angular/core';
import {Resolve} from '@angular/router';
import { Observable, of } from 'rxjs';
import {Store} from "@ngxs/store";
import {mapTo} from "rxjs/operators";
import {GetOrders} from "../state/actions/order.action";

@Injectable({
  providedIn: 'root'
})
export class OrderResolver implements Resolve<boolean> {
    constructor(private store: Store) {}
    resolve(): Observable<null> {
        return this.store
            .dispatch([
                new GetOrders({
                    page: 0,
                    size: 10,
                    status: ''
                }),
            ])
            .pipe(mapTo(null));
    }
}
