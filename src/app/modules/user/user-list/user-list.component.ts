import { Component, OnInit } from '@angular/core';
import {Select, Store} from "@ngxs/store";
import { UserStateModel } from 'app/shared/state/models/user';
import {Observable} from "rxjs";
import {UserState} from "../../../shared/state/user.state";
import {GetUsers} from "../../../shared/state/actions/user.action";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

    @Select(UserState.getUserList)
    users$: Observable<UserStateModel>;

    usersTableColumns: string[] = [
        'first_name',
        'last_name',
        'title',
        'email',
        'phone_number',
        'address'
    ];

    drawerMode: 'over' | 'side' = 'side';
    isLoading: boolean = false;

  constructor(public store: Store) { }

  ngOnInit(): void {
  }

    paging(e) {
        this.store.dispatch([
            new GetUsers({
                pageNumber: e.pageIndex,
                pageSize: 5
            }),
        ]);
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

}
