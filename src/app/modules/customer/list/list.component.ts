import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import {
    Customers, CustomerSearchStateModel,
    CustomerStateModel,
    Pagination,
} from '../../../shared/state/models/customer';
import { CustomerService } from '../../../shared/services/customer.service';
import { Select, Store } from '@ngxs/store';
import { CustomerState } from 'app/shared/state/customer.state';
import {GetCustomers} from 'app/shared/state/actions/customer.action';

@Component({
    selector: 'Customer-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class ListComponent implements OnInit, OnDestroy {
    @Select(CustomerState.getCustomerList)
    customers$: Observable<CustomerStateModel>;

    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    isLoading: boolean = false;
    pagination: Pagination;
    customersCount: number = 0;
    filterobj: any;
    drawerMode: 'over' | 'side' = 'side';
    filter$: BehaviorSubject<any> = new BehaviorSubject({param:'',val:''});
    searchQuery$: BehaviorSubject<string> = new BehaviorSubject('');
    customersTableColumns: string[] = [
        'customer_id',
        'nation_number',
        'first_name',
        'last_name',
    ];
    searchInputControl: FormControl = new FormControl();
    public _unsubscribeAll: Subject<any> = new Subject<any>();
    searchInput: boolean = false;

    constructor(
        public _changeDetectorRef: ChangeDetectorRef,
        public _formBuilder: FormBuilder,
        public _customerService: CustomerService,
        public store: Store
    ) {}

    ngOnInit(): void {


    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    paging(e) {
        this.store.dispatch([
            new GetCustomers({
                page: e.pageIndex,
                order: 'asc',
                size: 5,
                searchKey: '',
                sort: 'customer_id',
            }),
        ]);
    }

    searchByQuery(e) {
        this.searchQuery$.next(e);
        if(this.searchInput == false){
            this.searchInput = true;
            this.searchQuery$.subscribe(data=>{
                this.store
                    .dispatch([
                        new GetCustomers({
                            page: 0,
                            order: 'asc',
                            size: 5,
                            searchKey: data,
                            sort: 'customer_id'
                        }),
                    ]);
            });

        }

    }

    filterByQuery(param,val) {
        if (param=='first_name'){
            let search=this.filterobj.search;
            this.filterobj={search:search};
        }
        this.filter$.next({param:param,val:val});

    }
}
