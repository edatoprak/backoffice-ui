import {Injectable} from '@angular/core';
import { Resolve } from '@angular/router';
import {Observable, of} from 'rxjs';
import {mapTo} from "rxjs/operators";
import {Store} from '@ngxs/store';
import {GetUsers} from '../state/actions/user.action';

@Injectable({
    providedIn: 'root'
})
export class UserResolver implements Resolve<boolean> {
    constructor(private store: Store) {
    }

    resolve(): Observable<null> {
        return this.store
            .dispatch([
                new GetUsers({
                    pageNumber: 0,
                    pageSize: 10
                }),
            ])
            .pipe(mapTo(null));
    }
}
